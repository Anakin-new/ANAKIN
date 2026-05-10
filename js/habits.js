// js/habits.js

let habits = JSON.parse(localStorage.getItem("sovereign_habits")) || [
  { id: 1, name: "4 Hours Deep Work", history: [] },
  { id: 2, name: "NoFap Recovery", history: [] },
  { id: 3, name: "Truth Logged", history: [] },
];

// RELAPSE LOGIC: Resets the precise timestamp and the history
document.getElementById("relapsedBtn").addEventListener("click", () => {
  if (
    confirm(
      "Reset the clock? This action acknowledges a failure and restarts your recovery at 00:00:00.",
    )
  ) {
    // 1. Reset high-precision timestamp
    localStorage.setItem("nofap_relapse_timestamp", Date.now());

    // 2. Clear visual calendar history for NoFap
    const noFapHabit = habits.find((h) =>
      h.name.toLowerCase().includes("nofap"),
    );
    if (noFapHabit) {
      noFapHabit.history = [];
      saveAndRefresh();
    }
    alert("Clock reset. Return to the path immediately.");
  }
});

function renderHabits() {
  const habitsList = document.getElementById("habitsList");
  habitsList.innerHTML = "";
  const today = new Date().toDateString();

  habits.forEach((habit) => {
    const isCompletedToday = habit.history.includes(today);
    const div = document.createElement("div");
    div.className = "habit-item";
    div.innerHTML = `
            <input type="checkbox" id="hab_${habit.id}" ${isCompletedToday ? "checked" : ""}>
            <div class="habit-label-group" onclick="openCalendar(${habit.id})">
                <label>${habit.name}</label>
                <small style="display:block; color:var(--text-dim); font-size:0.6rem;">Click for calendar</small>
            </div>
            <button class="delete-habit-btn" onclick="deleteHabit(${habit.id})">×</button>
        `;
    div
      .querySelector("input")
      .addEventListener("change", () => toggleHabit(habit.id, today));
    habitsList.appendChild(div);
  });
}

function toggleHabit(id, date) {
  const habit = habits.find((h) => h.id === id);
  if (habit.history.includes(date)) {
    habit.history = habit.history.filter((d) => d !== date);
  } else {
    habit.history.push(date);
  }
  saveAndRefresh();
}

function saveAndRefresh() {
  localStorage.setItem("sovereign_habits", JSON.stringify(habits));
  renderHabits();
}

function deleteHabit(id) {
  if (confirm("Delete this discipline?")) {
    habits = habits.filter((h) => h.id !== id);
    saveAndRefresh();
  }
}

// CREATE NEW HABIT
document.getElementById("addHabitBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("newHabitName");
  if (!nameInput.value.trim()) return;
  const newHabit = {
    id: Date.now(),
    name: nameInput.value.trim(),
    history: [],
  };
  habits.push(newHabit);
  nameInput.value = "";
  saveAndRefresh();
});

// CALENDAR LOGIC
function openCalendar(id) {
  const habit = habits.find((h) => h.id === id);
  const modal = document.getElementById("calendarModal");
  const calendarGrid = document.getElementById("calendarGrid");
  document.getElementById("modalHabitName").innerText = habit.name;
  calendarGrid.innerHTML = "";
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = new Date(
      now.getFullYear(),
      now.getMonth(),
      i,
    ).toDateString();
    const isCompleted = habit.history.includes(dateString);
    const dayEl = document.createElement("div");
    dayEl.className = `cal-day ${isCompleted ? "completed" : ""}`;
    dayEl.innerText = i;
    calendarGrid.appendChild(dayEl);
  }
  modal.style.display = "block";
}

// Modal Close logic
document.querySelector(".close-modal").onclick = () =>
  (document.getElementById("calendarModal").style.display = "none");

renderHabits();
