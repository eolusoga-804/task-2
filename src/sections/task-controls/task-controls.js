// Renders status filters with live counts for each task state.
import { config } from "../../config.js";
import { tasks } from "../../state/tasks.js";
import {
  getTaskCounts,
  setTaskStatus,
  taskView,
} from "../../state/task-view.js";
import "./task-controls.css";

export function renderTaskControls() {
  const section = document.createElement("section");
  section.className = "task-controls";
  section.setAttribute("aria-label", "Task status filters");

  const buttons = config.statusFilters
    .map(
      (filter) => `
        <button
          class="task-controls__button"
          type="button"
          data-status="${filter.id}"
          aria-pressed="false"
        >
          <span>${filter.label}</span>
          <span class="task-controls__count" aria-hidden="true"></span>
        </button>
      `,
    )
    .join("");

  section.innerHTML = `<div class="task-controls__filters">${buttons}</div>`;

  // Updates filter button selection and live task counts.
  function updateControls() {
    const counts = getTaskCounts();

    section.querySelectorAll(".task-controls__button").forEach((button) => {
      const status = button.dataset.status;
      button.setAttribute("aria-pressed", String(taskView.status === status));
      button.querySelector(".task-controls__count").textContent =
        counts[status] ?? tasks.length;
    });
  }

  // Applies the selected filter to the shared task view state.
  section.addEventListener("click", (event) => {
    const button = event.target.closest(".task-controls__button");
    if (button) setTaskStatus(button.dataset.status);
  });

  updateControls();
  window.addEventListener(config.events.viewChanged, updateControls);
  window.addEventListener(config.events.tasksChanged, updateControls);

  return section;
}
