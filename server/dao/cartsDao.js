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
function addItemToUser(username, {id, title, cost, type}) {
  if (!carts[username]) {
    // Initialize cart if it doesn't exist
    carts[username] = [];
  }

  carts[username].push({ id, title, cost, type });
}

module.exports = { userHasItem, addItemToUser };
