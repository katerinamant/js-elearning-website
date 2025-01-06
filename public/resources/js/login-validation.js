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

  // If the form is invalid, prevent submission
  if (!form.checkValidity()) {
    event.stopPropagation();
  } else {
    // If the form is valid, authenticate user
    const username = usernameField.value;
    const password = passwordField.value;

    await authenticateUser(username, password);
  }
});

async function authenticateUser(username, password) {
  try {
    const response = await fetch(`${website}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login successful. Session ID:", data.sessionId);

    // Show success message
    showLoginMessage("Login successful!", "success");

    // Optionally, store the session ID (for demonstration purposes)
    localStorage.setItem("sessionId", data.sessionId);

    // Hide the login form or update the UI
    document.querySelector("#login-form").style.display = "none";
  } catch (error) {
    console.error("Error during login:", error);
    showLoginMessage(
      "Invalid username or password. Please try again.",
      "error"
    );
  }
}

function showLoginMessage(message, type) {
  const messageElement = document.querySelector("#login-message");
  messageElement.textContent = message;
  messageElement.style.backgroundColor = type === "success" ? "green" : "red";
}
