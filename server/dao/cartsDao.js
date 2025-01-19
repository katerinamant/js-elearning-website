const { ObjectId } = require("mongodb");

// Function to check if the user already has the item in their cart
async function userHasItem(db, username, itemId) {
  const cart = await db.collection("carts").findOne({ username });
  return cart && cart.items.some((item) => item.id === itemId);
}

// Function to add an item to the user's cart
async function addItemToUser(db, username, item) {
  await db.collection("carts").updateOne(
    { username },
    { $push: { items: item } },
    { upsert: true }
  );
}

// Function to remove an item from the user's cart
async function removeItemFromUser(db, username, itemId) {
  await db.collection("carts").updateOne(
    { username },
    { $pull: { items: { id: itemId } } }
  );
}

// Function to get all of the contents of a user's cart
async function getUserCart(db, username) {
  const cartCollection = db.collection("carts");
  const cart = await cartCollection.findOne({ username });

  if (!cart || !cart.items) {
    return { cartItems: [], totalCost: 0 }; // Ensure default format
  }

  // Ensure cart.items is an array before using reduce()
  const totalCost = cart.items.length > 0
    ? cart.items.reduce((sum, item) => sum + parseFloat(item.cost), 0)
    : 0;

  return {
    cartItems: cart.items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      cost: item.cost,
    })),
    totalCost,
  };
}

module.exports = { userHasItem, addItemToUser, removeItemFromUser, getUserCart };
