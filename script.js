const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const status = document.getElementById("status");

// Search for images
form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const query = input.value.trim();

  // Ignore empty searches
  if (query === "") {
    return;
  }

  // Show loading state
  status.textContent = "Searching for images...";
  results.innerHTML =
    '<p class="empty-message">Please wait...</p>';

  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    const images = Object.values(data.query?.pages || {});

    // Clear the loading message
    results.innerHTML = "";

    images.forEach(function(item) {
      const imageUrl = item.imageinfo?.[0]?.thumburl;

      if (!imageUrl) {
        return;
      }

      const card = document.createElement("div");
      card.className = "image-card";

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = item.title;
      img.loading = "lazy";

      const caption = document.createElement("p");
      caption.textContent = item.title.replace("File:", "");

      card.appendChild(img);
      card.appendChild(caption);
      results.appendChild(card);
    });

    // Show results or an empty message
    const total = results.children.length;

    if (total === 0) {
      results.innerHTML =
        '<p class="empty-message">No results found. Try another search.</p>';
      status.textContent = `No images found for "${query}".`;
    } else {
      status.textContent =
        `Showing ${total} images for "${query}"`;
    }

  } catch (error) {
    // Show error state
    results.innerHTML =
      '<p class="empty-message">Something went wrong. Please try again.</p>';

    status.textContent = "Unable to load images.";
    console.log(error);
  }
});

// Make the category buttons work
const categories = document.querySelectorAll(".categories button");

categories.forEach(function(button) {
  button.addEventListener("click", function() {
    input.value = button.textContent;
    form.requestSubmit();
  });
});