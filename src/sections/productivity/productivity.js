// Renders the completion ring and keeps its metrics synced with saved tasks.
import { config } from "../../config.js";
import { tasks } from "../../state/tasks.js";
import "./productivity.css";

export function renderProductivity() {
  const section = document.createElement("section");
  section.className = "productivity";
  section.setAttribute("aria-labelledby", "productivity-heading");

  section.innerHTML = `
    <h2 class="productivity__heading" id="productivity-heading"></h2>

    <div class="productivity__content">
      <div
        class="productivity__progress"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <span class="visually-hidden"></span>
        <svg class="productivity__ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="productivity__track" cx="50" cy="50" r="40"></circle>
          <circle class="productivity__value" cx="50" cy="50" r="40"></circle>
        </svg>
        <span class="productivity__percentage" aria-hidden="true">0%</span>
      </div>

      <div class="productivity__details">
        <p class="productivity__count"></p>
        <p class="productivity__message"></p>
      </div>
    </div>
  `;

  const progress = section.querySelector(".productivity__progress");
  const ring = section.querySelector(".productivity__value");
  const percentage = section.querySelector(".productivity__percentage");
  const count = section.querySelector(".productivity__count");
  const message = section.querySelector(".productivity__message");

  section.querySelector(".productivity__heading").textContent =
    config.productivity.heading;
  progress.setAttribute("aria-label", config.productivity.progressLabel);

  // Updates the progress ring, task count, and encouragement message.
  function updateProductivity() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const circumference = 251.2;

    progress.setAttribute("aria-valuenow", String(percent));
    percentage.textContent = `${percent}%`;
    ring.style.strokeDashoffset = String(circumference * (1 - percent / 100));
    count.textContent = `${completed} / ${total} ${config.productivity.completedLabel}`;

    if (total === 0) {
      message.textContent = config.productivity.emptyMessage;
    } else if (percent === 100) {
      message.textContent = config.productivity.completeMessage;
    } else if (percent >= config.productivity.strongThreshold) {
      message.textContent = config.productivity.strongMessage;
    } else if (percent >= config.productivity.steadyThreshold) {
      message.textContent = config.productivity.steadyMessage;
    } else {
      message.textContent = config.productivity.steadyMessage;
    }
  }

  updateProductivity();
  window.addEventListener(config.events.tasksChanged, updateProductivity);

  return section;
}
