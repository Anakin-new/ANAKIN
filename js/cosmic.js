// js/cosmic.js
async function fetchCosmicPerspective() {
  const imgContainer = document.getElementById("cosmicImageContainer");
  const title = document.getElementById("cosmicTitle");
  const exp = document.getElementById("cosmicExplanation");

  title.innerText = "Connecting to NASA APOD...";

  try {
    // Using NASA APOD DEMO_KEY. (Replace 'DEMO_KEY' with your own NASA API key for heavy use)
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=dO7Rj2QzAN63fd3LPsNw9v6KtORagslt67fWSitN&count=1",
    );
    const data = await response.json();
    const entry = data[0];

    imgContainer.style.backgroundImage = `url(${entry.url})`;
    title.innerText = entry.title;
    // Truncate explanation to keep it punchy
    exp.innerText =
      entry.explanation.substring(0, 300) +
      "... \n\nRemember your scale. Your anxieties are microscopic.";
  } catch (error) {
    title.innerText = "Telemetry Failed.";
    exp.innerText =
      "Could not reach the stars. Look up tonight instead. The universe does not require an internet connection to humble you.";
  }
}

document
  .getElementById("refreshCosmic")
  .addEventListener("click", fetchCosmicPerspective);

// Load on mount
fetchCosmicPerspective();
