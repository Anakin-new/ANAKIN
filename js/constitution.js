// js/constitution.js
const lawsArea = document.getElementById("lawsArea");

// Load
if (localStorage.getItem("sovereign_laws")) {
  lawsArea.innerHTML = localStorage.getItem("sovereign_laws");
}

// Save
document.getElementById("saveLaws").addEventListener("click", () => {
  localStorage.setItem("sovereign_laws", lawsArea.innerHTML);
  alert("Laws solidified. You are bound by these words.");
});
