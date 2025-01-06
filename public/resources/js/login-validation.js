// Get form and elements
const form = document.getElementById("login-form");
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");

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

    // store the session ID
    localStorage.setItem("sessionId", data.sessionId);

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

function showLoginMessage(message, type) {
  const messageElement = document.querySelector("#login-message");
  messageElement.style.display = "block";
  messageElement.textContent = message;
  messageElement.style.backgroundColor = type === "success" ? "green" : "red";
}

// Function to "reset" the page when the user logs out
document.querySelector("#logout-btn").addEventListener("click", () => {
  // Clear session data
  localStorage.removeItem("sessionId");

  // Show the login form and hide the login message and the welcome section
  document.querySelector("#login-section").style.display = "block";
  document.querySelector("#login-message").style.display = "none";
  document.querySelector("#welcome-section").style.display = "none";
});
