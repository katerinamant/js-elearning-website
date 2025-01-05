const website = "https://learning-hub-1whk.onrender.com";

window.addEventListener("DOMContentLoaded", async () => {
  function showError(log, msg) {
    console.error(log);
    document.querySelector("#books-list").innerHTML = `
              <p style="color: red;">${msg}</p>
              `;
    document.querySelector("#lectures-list").innerHTML = `
              <p style="color: red;">${msg}</p>
              `;
  }

  console.log("DOM fully loaded. Fetching items...");

  const params = new URLSearchParams(window.location.search);
  // Get the category ID from the URL
  const categoryId = params.get("id");

  // Get the category title from the URL
  const categoryTitle = params.get("title");

  if (!categoryId) {
    showError(
      "No category ID provided in the URL.",
      "Error loading content. Please provide a category ID!"
    );
    return;
  }
  console.log(`Received category id=${categoryId}`);

  if (!categoryTitle) {
    showError(
      "No category title provided in the URL.",
      "Error loading content. Please provide a category title!"
    );
    return;
  }

  try {
    // Render category title
    renderTitle(categoryTitle);

    // Fetch learning items
    const items = await fetchItems(categoryId);

    // Check if response is empty
    if (items.length == 0) {
      console.log("Received empty response");
      throw new Error(`HTTP error! Empty response.`);
    }

    // Render items
    renderItems(items);
  } catch (error) {
    showError(
      `An error occured: ${error}`,
      "Error loading content. Please try again later :("
    );
    return;
  }
});

// Function to render the category title
function renderTitle(categoryTitle) {
  console.log("Rendering title...");

  // Get the Handlebars template from the HTML
  const titleScript = document.querySelector("#category-title-template");

  // Compile the template
  const template = Handlebars.compile(titleScript.textContent);
  console.log("Title template compiled successfully.");

  // Render the template with the category title
  const titleContent = template({ title: categoryTitle });

  // Inject the rendered HTML into the placeholder div
  document.querySelector("#category-title").innerHTML = titleContent;
  console.log("Title rendered successfully.");
}

// Function to fetch the learning items
async function fetchItems(categoryId) {
  console.log("Sending GET request to fetch items...");

  const response = await fetch(
    `${website}/learning-items?category=${categoryId}`
  );

  // Check if the response is not successful
  if (!response.ok) {
    console.log("Received response:", response);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Parse and return the response body as JSON
  const items = await response.json();
  console.log("Items data received:", items);

  // Fix image url for the items
  items.forEach((item) => {
    item.image = `${website}/${item.image}`;
  });

  return items;
}

// Function to seperate books and lectures and render them
function renderItems(items) {
  // Separate items into books and lectures
  const books = items.filter((item) => item.type === "Book");
  const lectures = items.filter((item) => item.type === "Lecture");

  // Render books
  renderBooks(books);

  // Render lectures
  renderLectures(lectures);
}

// Function to render books
function renderBooks(books) {
  // Handle empty list
  if (books.length === 0) {
    document.querySelector("#books-list").innerHTML =
      "<p>No books available. We are working on it!</p>";
    return;
  }
  
  console.log("Rendering books...");

  // Get the Handlebars template from the HTML
  const booksScript = document.querySelector("#books-template");

  // Compile the template
  const template = Handlebars.compile(booksScript.textContent);
  console.log("Books template compiled successfully.");

  // Render the template with the fetched books
  const booksContent = template({ books });

  // Inject the rendered HTML into the placeholder div
  document.querySelector("#books-list").innerHTML = booksContent;
  console.log("Books rendered successfully.");
}

// Function to render lectures
function renderLectures(lectures) {
  // Handle empty list
  if (lectures.length === 0) {
    document.querySelector("#lectures-list").innerHTML =
      "<p>No lectures available. We are working on it!</p>";
    return;
  }

  console.log("Rendering lectures...");

  // Get the Handlebars template from the HTML
  const lecturesScript = document.querySelector("#lectures-template");

  // Compile the template
  const template = Handlebars.compile(lecturesScript.textContent);
  console.log("Lectured template compiled successfully.");

  // Render the template with the fetched lectures
  const lecturesContent = template({ lectures });

  // Inject the rendered HTML into the placeholder div
  document.querySelector("#lectures-list").innerHTML = lecturesContent;
  console.log("Lectures rendered successfully.");
}
