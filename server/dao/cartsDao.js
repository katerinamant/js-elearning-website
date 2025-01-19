// Local storage of carts
const carts = {}; // { username: [{ id, title, cost, type }] }

// Function to check if the user already has the item in their cart
async function userHasItem(db, username, itemId) {
  if (!db) {
    // Use local storage
    if (!carts[username]) {
      // Cart is empty
      return false;
    }

    return carts[username].some((item) => item.id === itemId);
  }

  // Look up in MongoDB
  const cart = await db.collection("carts").findOne({ username });
  return cart && cart.items.some((item) => item.id === itemId);
}

// Function to add an item to the user's cart
async function addItemToUser(db, username, { id, title, cost, type }) {
  if (!db) {
    // Use local storage
    if (!carts[username]) {
      // Initialize cart if it doesn't exist
      carts[username] = [];
    }

    carts[username].push({ id, title, cost, type });
    return;
  }

  // Use MongoDB
  await db
    .collection("carts")
    .updateOne({ username }, { $push: { items: { id, title, cost, type } } }, { upsert: true });
}

// Function to remove an item from the user's cart
async function removeItemFromUser(db, username, itemId) {
  if (!db) {
    // Use local storage
    if (!carts[username]) {
      return;
    }

    const itemIndex = carts[username].findIndex((item) => item.id === itemId);
    if (itemIndex == -1) {
      return;
    }

    carts[username].splice(itemIndex, 1);
    return;
  }

  // Update MongoDB
  await db
    .collection("carts")
    .updateOne({ username }, { $pull: { items: { id: itemId } } });
}

// Function to get all of the contents of a user's cart
async function getUserCart(db, username) {
  if (!db) {
    // Use local storage
    const cart = carts[username] || [];
    return {
      cartItems: cart,
      totalCost: cart.reduce((sum, item) => sum + parseFloat(item.cost), 0),
    };
  }

  // Look up in MongoDB
  const cart = await db.collection("carts").findOne({ username });
  return cart
    ? {
        cartItems: cart.items,
        totalCost: cart.items.reduce(
          (sum, item) => sum + parseFloat(item.cost),
          0
        ),
      }
    : { cartItems: [], totalCost: 0 };
}

module.exports = {
  userHasItem,
  addItemToUser,
  removeItemFromUser,
  getUserCart,
};
