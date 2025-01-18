const carts = {}; // { username: [{ id, title, cost, type }] }

// Function to check if the user already has the item in their cart
function userHasItem(username, itemId) {
  if (!carts[username]) {
    // Cart is empty
    return false;
  }

  return carts[username].some((item) => item.id === itemId);
}

// Function to add item to the user's cart
function addItemToUser(username, { id, title, cost, type }) {
  if (!carts[username]) {
    // Initialize cart if it doesn't exist
    carts[username] = [];
  }

  carts[username].push({ id, title, cost, type });
}

// Function to remove item from user's cart
function removeItemFromUser(username, id) {
  if (!carts[username]) {
    return;
  }

  const itemIndex = carts[username].findIndex((item) => item.id === id);
  if (itemIndex == -1) {
    return;
  }

  carts[username].splice(itemIndex, 1);
}

// Function to get all of the contents of a user's cart
function getUserCart(username) {
  cart = carts[username] || [];

  const totalCost = cart.reduce((sum, item) => sum + parseFloat(item.cost), 0);

  // Return the JSON string
  return {
    cartItems: cart,
    totalCost: totalCost,
  };
}

module.exports = {
  userHasItem,
  addItemToUser,
  removeItemFromUser,
  getUserCart,
};
