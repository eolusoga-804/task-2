// Renders the time-based greeting and current date.
import { config } from "../../config.js";
import { getUserName } from "../../state/preferences.js";
import "./greeting.css";

export function renderGreeting() {
  const section = document.createElement("section");
  section.className = "greeting";
  section.setAttribute("aria-labelledby", "greeting-title");

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? config.greetings.morning
      : hour < 18
        ? config.greetings.afternoon
        : config.greetings.evening;

  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat(config.locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);
  const weekday = new Intl.DateTimeFormat(config.locale, {
    weekday: "long",
  }).format(now);

  section.innerHTML = `
    <div class="greeting__message">
      <i class="fi fi-rr-hand-wave greeting__icon" aria-hidden="true"></i>
      <div>
        <h1 class="greeting__title" id="greeting-title">
          <span class="greeting__salutation"></span>
          <span class="greeting__name"></span>
        </h1>
        <p class="greeting__tagline"></p>
      </div>
    </div>

    <div class="greeting__date">
      <i class="fi fi-rr-calendar greeting__date-icon" aria-hidden="true"></i>
      <div>
        <span class="greeting__date-label"></span>
        <time class="greeting__date-value"></time>
        <span class="greeting__weekday"></span>
      </div>
    </div>
  `;

  // Inserts dynamic text safely without treating the saved name as markup.
  section.querySelector(".greeting__salutation").textContent = `${greeting},`;

  // Updates the greeting immediately after the first-visit name is saved.
  function updateGreetingName() {
    const name = getUserName() || config.greetings.fallbackName;
    section.querySelector(".greeting__name").textContent = `${name}!`;
  }

  // Shows the saved name initially and reacts to the name dialog event.
  updateGreetingName();
  window.addEventListener(config.events.userNameSaved, updateGreetingName);

  section.querySelector(".greeting__tagline").textContent = config.text.tagline;
  section.querySelector(".greeting__date-label").textContent =
    config.greetings.dateLabel;
  section.querySelector(".greeting__date-value").textContent = formattedDate;
  section.querySelector(".greeting__date-value").dateTime = now.toISOString();
  section.querySelector(".greeting__weekday").textContent = weekday;

  return section;
}
