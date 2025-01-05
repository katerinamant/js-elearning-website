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
  // Get the category title from the URL
  // It is used in the title of the page.
  const categoryTitle = params.get("categoryTitle");

  // Get the subcategory ID from the URL
  const subcategoryId = params.get("id");

  // Get the subcategory title from the URL
  const subcategoryTitle = params.get("title");

  if (!categoryTitle) {
    showError(
      "No category title provided in the URL.",
      "Error loading content. Please provide a category title!"
    );
    return;
  }

  if (!subcategoryId) {
    showError(
      "No subcategory ID provided in the URL.",
      "Error loading content. Please provide a subcategory ID!"
    );
    return;
  }

  if (!subcategoryTitle) {
    showError(
      "No subcategory title provided in the URL.",
      "Error loading content. Please provide a subcategory title!"
    );
    return;
  }

  try {
    // Render subcategory title
    renderTitle(categoryTitle, subcategoryTitle);

    // Fetch learning items
    const items = await fetchItems(subcategoryId);

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

// Function to render the subcategory title
function renderTitle(categoryTitle, subcategoryTitle) {
  console.log("Rendering title...");

  // Get the Handlebars template from the HTML
  const titleScript = document.querySelector("#subcategory-title-template");

  // Compile the template
  const template = Handlebars.compile(titleScript.textContent);
  console.log("Title template compiled successfully.");

  // Render the template with the subcategory title
  const titleContent = template({categoryTitle: categoryTitle, subcategoryTitle: subcategoryTitle });

  // Inject the rendered HTML into the placeholder div
  document.querySelector("#subcategory-title").innerHTML = titleContent;
  console.log("Title rendered successfully.");
}

// Function to fetch the learning items
async function fetchItems(subcategoryId) {
  console.log("Sending GET request to fetch items...");

  const response = await fetch(
    `${website}/learning-items?subcategory=${subcategoryId}`
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

  // Render the features table for each item
  renderFeatures(items);
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
  console.log("Lectures template compiled successfully.");

  // Render the template with the fetched lectures
  const lecturesContent = template({ lectures });

  // Inject the rendered HTML into the placeholder div
  document.querySelector("#lectures-list").innerHTML = lecturesContent;
  console.log("Lectures rendered successfully.");
}

// Function to render the feature table
function renderFeatures(items) {
  // Get the Handlebars template from the HTML
  const featuresScript = document.querySelector("#features-template");

  // Compile the template
  const template = Handlebars.compile(featuresScript.textContent);
  console.log("Features table template compiled successfully.");

  items.forEach((item) => {
    // Parse the features string for each item
    item.features = parseFeatures(item.features);

    // Render the features table using Handlebars
    const featuresContent = template({ features: item.features });

    // Inject the table into the corresponding item's div
    document.querySelector(`#features-${item.id}`).innerHTML = featuresContent;
  });
}

// Function to parse the features string from the response
function parseFeatures(features) {
  // Split by semicolons to get individual features
  const featuresArray = features.split(";");

  // Convert each feature into a key-value pair
  return featuresArray.map((feature) => {
    const [key, value] = feature.split(":");
    return { key: key.trim(), value: value.trim() };
  });
}
