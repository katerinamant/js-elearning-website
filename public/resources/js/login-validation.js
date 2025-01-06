// Get form and elements
const form = document.getElementById("login-form");
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");

// First check if sessionId still exists in the browser
document.addEventListener("DOMContentLoaded", () => {
  const sessionId = localStorage.getItem("sessionId");
  const username = localStorage.getItem("username");

  if (sessionId && username) {
    // User is logged in, show welcome section
    document.getElementById("login-section").style.display = "none";
    document.getElementById("welcome-section").style.display = "block";
    document.getElementById("logged-in-user").textContent = username;
  } else {
    // No valid session, show login section
    document.getElementById("login-section").style.display = "block";
    document.getElementById("welcome-section").style.display = "none";
  }
});

// Validate username
function validateUsername() {
  // Check for empty input
  if (!usernameField.value) {
    // It is a required field,
    // so this is handled by the HTML form
    return;
  }

  const username = usernameField.value;

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    usernameField.setCustomValidity(
      "Username must contain only letters and numbers."
    );
    usernameField.reportValidity();
  } else {
    usernameField.setCustomValidity(""); // Reset validation
  }
}

// Add event listener
usernameField.addEventListener("input", validateUsername);

// On form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Perform validation
  validateUsername();

  if (!form.checkValidity()) {
    // Return on invalid form
    return;
  } else {
    // If the form is valid, authenticate user
    const username = usernameField.value;
    const password = passwordField.value;

    await authenticateUser(username, password);
  }
});

async function authenticateUser(username, password) {
  try {
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    };
    console.log("Sending request to server:", options);

    const response = await fetch("http://localhost:3000/login", options);
    console.log("Received response:", response);

    if (!response.ok) {
      throw new Error(`Login failed. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login successful. Session ID:", data.sessionId);

    // Show success message
    showLoginMessage("Login successful!", "success");

    // Store the session ID and the username
    localStorage.setItem("sessionId", data.sessionId);
    localStorage.setItem("username", username);

    // Show the welcome message
    showWelcomeMessage(username);
  } catch (error) {
    console.error("Error during login:", error);
    showLoginMessage(
      "Invalid username or password. Please try again.",
      "error"
    );
  }
}

// Function to replace the Login form with a welcome message
function showWelcomeMessage(username) {
  // Get elements
  const loginSection = document.querySelector("#login-section");
  const welcomeSection = document.querySelector("#welcome-section");
  const loggedInUser = document.querySelector("#logged-in-user");

  // Set the username in the welcome message
  loggedInUser.textContent = username;

  // Hide the login section and show the welcome section
  loginSection.style.display = "none";
  welcomeSection.style.display = "block";
}

// Function to show a message under the Login form
function showLoginMessage(message, type) {
  const messageElement = document.querySelector("#login-message");
  messageElement.style.display = "block";
  messageElement.textContent = message;
  messageElement.style.backgroundColor = type === "success" ? "green" : "red";
}
