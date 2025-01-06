// "Reset" the page when the user logs out
document.querySelector("#logout-btn").addEventListener("click", async () => {
  try {
    let sessionId = localStorage.getItem("sessionId");
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId }),
    };
    console.log("Sending request to server:", options);

    const response = await fetch("http://localhost:3000/logout", options);
    console.log("Received response:", response);

    if (!response.ok) {
      throw new Error(`Logout failed. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Logout failed. Please try again.");
  }

  // Clear session data
  localStorage.removeItem("sessionId");
  localStorage.removeItem("username");

  // Show the login form and hide the login message and the welcome section
  document.querySelector("#login-section").style.display = "block";
  document.querySelector("#login-message").style.display = "none";
  document.querySelector("#welcome-section").style.display = "none";
});
