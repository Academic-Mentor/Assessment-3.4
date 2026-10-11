const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const status = document.getElementById("status");

form.addEventListener("submit", async function(event) {
event.preventDefault();

  const query = input.value.trim();

  if (query === "") {
    return;
  }

  results.innerHTML = "";
  status.textContent = "Searching...";

  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }

    const data = await response.json();
    const images = Object.values(data.query?.pages || {});

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

    status.textContent =
      `${results.children.length} images found for "${query}"`;

    if (results.children.length === 0) {
      results.innerHTML =
        '<p class="empty-message">No images found. Try another search.</p>';
      status.textContent = "0 images found";
    }

  } catch (error) {
    console.log(error);
    status.textContent = "Unable to load images. Please try again.";
  }
});

const categories = document.querySelectorAll(".categories button");

categories.forEach(function(button) {
  button.addEventListener("click", function() {
    input.value = button.textContent;
    form.requestSubmit();
  });
});