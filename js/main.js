// js/main.js

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

function updateDateTime() {
  const dt = document.getElementById("datetime");
  if (dt) {
    const now = new Date();
    dt.innerText =
      now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " | " +
      now.toLocaleTimeString("en-US", { hour12: false });
  }
}

async function loadDashboardData() {
  const streakElement = document.getElementById("homeStreak");
  const habits = JSON.parse(localStorage.getItem("sovereign_habits") || "[]");

  // 1. Calculate General Integrity Streak
  if (streakElement) {
    streakElement.innerText = calculateIntegrityStreak(habits);
  }

  // 2. Start Live Recovery Timer (NoFap)
  startRecoveryTimer();

  // 3. Load Perspective
  loadPerspective();
}

function startRecoveryTimer() {
  const recoveryElement = document.getElementById("recoveryStreak");
  if (!recoveryElement) return;

  // Retrieve the exact timestamp of the last relapse
  let lastRelapse = localStorage.getItem("nofap_relapse_timestamp");

  // If it's the first time using the app, set the starting point to now
  if (!lastRelapse) {
    lastRelapse = Date.now();
    localStorage.setItem("nofap_relapse_timestamp", lastRelapse);
  }

  setInterval(() => {
    const now = new Date().getTime();
    const distance = now - lastRelapse;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    recoveryElement.innerHTML = `
            <div style="font-size: 1.5rem; letter-spacing: 1px;">${days}d ${hours}h ${minutes}m</div>
            <div style="font-size: 0.8rem; color: var(--accent); margin-top: 5px;">${seconds}s ELAPSED</div>
        `;
  }, 1000);
}

function calculateIntegrityStreak(habits) {
  const allDates = [...new Set(habits.flatMap((h) => h.history))];
  return calculateHabitStreak(allDates);
}

function calculateHabitStreak(history) {
  if (!history || history.length === 0) return 0;
  const sortedDates = history
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);
  let streak = 0;
  let today = new Date().setHours(0, 0, 0, 0);
  let yesterday = today - 86400000;
  if (sortedDates[0] < yesterday) return 0;
  let currentExpected = sortedDates[0];
  for (let date of sortedDates) {
    if (date === currentExpected) {
      streak++;
      currentExpected -= 86400000;
    } else {
      break;
    }
  }
  return streak;
}

// Logic for Nietzsche Quote
// Replace your existing loadPerspective function in main.js with this:

async function loadPerspective() {
  const quoteElement = document.getElementById("nietzscheQuote");
  const authorElement = document.getElementById("quoteAuthor");

  const localVault = [
    {
      text: "He who has a why to live for can bear almost any how.",
      author: "Friedrich Nietzsche",
    },
    {
      text: "No price is too high to pay for the privilege of owning yourself.",
      author: "Friedrich Nietzsche",
    },
    {
      text: "You have power over your mind - not outside events.",
      author: "Marcus Aurelius",
    },
    {
      text: "Difficulties strengthen the mind, as labor does the body.",
      author: "Seneca",
    },
    {
      text: "We suffer more often in imagination than in reality.",
      author: "Seneca",
    },
    {
      text: "Waste no more time arguing what a good man should be. Be one.",
      author: "Marcus Aurelius",
    },
    {
      text: "The best revenge is to be unlike him who performed the injury.",
      author: "Marcus Aurelius",
    },
    {
      text: "Luck is what happens when preparation meets opportunity.",
      author: "Seneca",
    },
    {
      text: "If it is not right do not do it; if it is not true do not say it.",
      author: "Marcus Aurelius",
    },
    {
      text: "Control your passions lest they take vengeance on you.",
      author: "Epictetus",
    },
    {
      text: "It is a rough road that leads to the heights of greatness.",
      author: "Seneca",
    },
    {
      text: "Small-minded people blame others. Average people blame themselves. The wise see all blame as foolishness.",
      author: "Epictetus",
    },
    {
      text: "The soul becomes dyed with the color of its thoughts.",
      author: "Marcus Aurelius",
    },
  ];

  try {
    const response = await fetch("https://stoic-quotes.com/api/quote", {
      signal: AbortSignal.timeout(3000),
    });
    const data = await response.json();
    quoteElement.innerText = `"${data.text}"`;
    authorElement.innerText = `- ${data.author}`;
  } catch (e) {
    // Improved Daily Rotation Logic
    const now = new Date();
    // Using a combination of year, month, and date to ensure a unique index per day
    const dayIndex =
      now.getFullYear() * 31 + now.getMonth() * 31 + now.getDate();
    const fallback = localVault[dayIndex % localVault.length];

    quoteElement.innerText = `"${fallback.text}"`;
    authorElement.innerText = `- ${fallback.author}`;
    console.log("Network quote failed. Rotating from local vault.");
  }
}

setInterval(updateDateTime, 1000);
updateDateTime();
loadDashboardData();
