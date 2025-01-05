const website = "https://learning-hub-1whk.onrender.com";

window.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded. Fetching categories...");

  try {
    // Fetch and render all categories
    const categories = await fetchAndRenderCategories();

    // Fetch and render subcategories for each category
    await fetchAndRenderSubcategories(categories);
  } catch (error) {
    console.error("An error occured:", error);

    // Display an error message
    document.getElementById("categories-list").innerHTML = `
      <p style="color: red;">Error loading categories. Please try again later :(</p>
    `;
  }
});

// Function to fetch and render all categories
async function fetchAndRenderCategories() {
  const categories = await fetchCategories();
  renderCategories(categories);

  return categories;
}

// Async function to fetch categories
async function fetchCategories() {
  console.log("Sending GET request to fetch categories...");

  const response = await fetch(`${website}/categories`);

  // Check if the response is not successful
  if (!response.ok) {
    console.log("Received response:", response);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Parse and return the response body as JSON
  const categories = await response.json();
  console.log("Categories data received:", categories);

  // Fix image url for the categories
  categories.forEach((category) => {
    category.img_url = `${website}/${category.img_url}`;
  });

  return categories;
}

// Function to render categories using Handlebars
function renderCategories(categories) {
  console.log("Rendering categories...");

  // Get the Handlebars template from the HTML
  const categoriesScript = document.querySelector("#categories-template");

  // Compile the template
  const template = Handlebars.compile(categoriesScript.textContent);
  console.log("Categories template compiled successfully.");

  // Render the template with the fetched categories
  const categoriesContent = template({ categories: categories });

  // Inject the rendered HTML into the placeholder div
  document.querySelector("#categories-list").innerHTML = categoriesContent;
  console.log("Categories rendered successfully.");
}

// Function to fetch and render subcategories for all categories
async function fetchAndRenderSubcategories(categories) {
  for (const category of categories) {
    const subcategories = await fetchSubcategories(category.id);
    renderSubcategories(category.id, category.title, subcategories);
  }
}

// Async function to fetch subcategories for a given category ID
async function fetchSubcategories(categoryId) {
  try {
    console.log(`Fetching subcategories for category ID: ${categoryId}`);

    const response = await fetch(
      `${website}/categories/${categoryId}/subcategories`
    );

    // Check if the response is not successful
    if (!response.ok) {
      console.log("Received response:", response);
      throw new Error(`Failed to fetch subcategories: ${response.status}`);
    }

    // Parse and return the response body as JSON
    const subcategories = await response.json();
    console.log("Subcategories data received:", subcategories);
    return subcategories;
  } catch (error) {
    // We use a separate catch here.
    // That way the rest of the categories
    // with their subcategories will still work.
    console.error(
      `Error fetching subcategories for category ID ${categoryId}: ${error}`
    );
    return [];
  }
}

// Function to render subcategories using Handlebars
function renderSubcategories(categoryId, categoryTitle, subcategories) {
  console.log(`Rendering subcategories for category ID: ${categoryId}...`);

  // Get the Handlebars template from the HTML
  const subcategoriesScript = document.querySelector("#subcategories-template");

  // Compile the template
  const template = Handlebars.compile(subcategoriesScript.textContent);
  console.log(
    `Subcategories template for category ID: ${categoryId} compiled successfully.`
  );

  // Render the template with the fetched subcategories
  // We are passing the category title as well
  // to use it in the header of the subcategory page
  const subcategoriesContent = template({ subcategories: subcategories, categoryTitle: categoryTitle });

  // Inject the rendered HTML into the placeholder div
  document.querySelector(`#subcategories-${categoryId}-list`).innerHTML =
    subcategoriesContent;
  console.log(
    `Subcategories rendered successfully for category ID: ${categoryId}`
  );
}
