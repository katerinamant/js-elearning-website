document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (event) => {
    // If user clicks the buy button
    if (event.target.classList.contains("buy-btn")) {
      const button = event.target;

      // Check if user is logged in
      const sessionId = localStorage.getItem("sessionId");
      const username = localStorage.getItem("username");

      if (!sessionId || !username) {
        alert("Please log in to add items to your cart.");
        console.log("Request blocked because the user is not logged in.");
        event.stopPropagation(); // Stop event propagation
        return;
      }

      // Prepare data for the request
      const itemData = {
        id: button.getAttribute("data-id"),
        title: button.getAttribute("data-title"),
        cost: button.getAttribute("data-cost"),
        type: button.getAttribute("data-type"),
        username: username,
        sessionId: sessionId,
      };

      try {
        let options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        };
        console.log("Sending request to server:", options);

        const response = await fetch("http://localhost:3000/cart", options);
        console.log("Received response:", response);

        // Parse the JSON response
        const data = await response.json();

        if (response.status === 200) {
          // Item added to cart
          alert(data.message); // "Item added to cart successfully"
        } else if (response.status === 409) {
          // Item already in cart
          alert(data.message); // "Item is already in your cart"
        } else {
          // Handle other errors
          throw new Error();
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  });
});
