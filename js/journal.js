const editorOverlay = document.getElementById("editorOverlay");
const journalInput = document.getElementById("journalInput");
const journalHistory = document.getElementById("journalHistory");

function loadJournal() {
  const history = JSON.parse(localStorage.getItem("sovereign_journal") || "[]");

  if (history.length === 0) {
    journalHistory.innerHTML = `<p style="color:var(--text-dim); text-align:center; margin-top:40px;">The archives are empty. Begin the log.</p>`;
    return;
  }

  journalHistory.innerHTML = history
    .map(
      (entry) => `
            <div class="entry-log">
                <span class="entry-date">${entry.date}</span>
                <p>${entry.text.replace(/\n/g, "<br>")}</p>
            </div>
        `,
    )
    .join("");
}

// UI Controls
document.getElementById("newEntryBtn").addEventListener("click", () => {
  editorOverlay.style.display = "flex";

  // Small delay to ensure the keyboard doesn't push the button out of view
  setTimeout(() => {
    journalInput.focus();
  }, 100);
});

document.getElementById("closeEditor").addEventListener("click", () => {
  if (journalInput.value.trim() && !confirm("Discard unarchived truth?"))
    return;
  closeEditor();
});

function closeEditor() {
  editorOverlay.style.display = "none";
  journalInput.value = "";
}

// Save Logic
document.getElementById("saveJournal").addEventListener("click", () => {
  const text = journalInput.value.trim();
  if (!text) return;

  const history = JSON.parse(localStorage.getItem("sovereign_journal") || "[]");
  history.unshift({
    date: new Date().toLocaleString(),
    text: text,
  });

  localStorage.setItem(
    "sovereign_journal",
    JSON.stringify(history.slice(0, 50)),
  );

  closeEditor();
  loadJournal();
});

// Initial Load
loadJournal();
