// Base URL for your backend API
const API_URL = "http://localhost:3000";

// Utility function to extract the slug from the URL
// Assumes URL structure like: /preview/your-image-slug
function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}
const slug = getSlugFromQuery();

// DOM Elements
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const imageContent = document.getElementById("image-content");
const imageEl = document.getElementById("image-preview");
const titleEl = document.getElementById("image-title");
const descriptionEl = document.getElementById("image-description");
const downloadBtn = document.getElementById("download-btn");
const embedBtn = document.getElementById("embed-btn");
const shareBtn = document.getElementById("share-btn");

let imageData = null;

// Fetch image details from the backend API
async function fetchImage() {
  try {
    const response = await fetch(`${API_URL}/api/images/slug/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    imageData = await response.json();
    renderImage();
  } catch (error) {
    errorDiv.textContent = "Failed to load image details.";
    console.error(error);
  } finally {
    loadingDiv.classList.add("hidden");
  }
}

// Render the image preview on the page
function renderImage() {
  if (!imageData) return;
  
  imageEl.src = imageData.imageUrl;
  imageEl.alt = imageData.title || "Image Preview";
  titleEl.textContent = imageData.title || "Untitled";
  descriptionEl.textContent = imageData.description || "No description available.";
  
  imageContent.classList.remove("hidden");
}

// Download image handler
downloadBtn.addEventListener("click", async (e) => {
  const imageUrl =  imageData.imageUrl;
  e.preventDefault();
  try {
    // Fetch the image blob from your backend download endpoint
    const response = await fetch(`${API_URL}/api/images/${slug}/download`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Convert response to a blob
    const blob = await response.blob();
    
    // Create a temporary URL for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Create an anchor element and trigger a download
    const a = document.createElement('a');
    a.href = downloadUrl;
    // a.download = `${slug}.png`; // Set the filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    // Revoke the blob URL to free up resources
    window.URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error("Download failed:", error);
  }
});

// Embed code handler: Copies the embed HTML to clipboard
embedBtn.addEventListener("click", () => {
  const embedCode = `<img src="${imageData.imageUrl}" alt="${imageData.title}" />`;
  navigator.clipboard.writeText(embedCode)
    .then(() => alert("Embed code copied to clipboard!"))
    .catch((err) => {
      console.error("Failed to copy embed code: ", err);
    });
});

// Share handler: Uses Web Share API if available
shareBtn.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: imageData.title,
        text: imageData.description,
        url: imageData.imageUrl ,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    alert("Sharing is not supported in your browser. The image URL has been copied to your clipboard.");
    navigator.clipboard.writeText(imageData.image);
  }
});

// Initialize the page by fetching the image data
fetchImage();
