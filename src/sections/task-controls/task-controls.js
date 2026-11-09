// Renders status filters and sort controls for the task list.
import { config } from "../../config.js";
import { tasks } from "../../state/tasks.js";
import {
  getTaskCounts,
  setTaskSort,
  setTaskStatus,
  taskView,
  toggleTaskSortDirection,
} from "../../state/task-view.js";
import "./task-controls.css";

export function renderTaskControls() {
  const section = document.createElement("section");
  section.className = "task-controls";
  section.setAttribute("aria-label", config.taskControls.statusLabel);

  const statusButtons = config.statusFilters
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

  const sortOptions = config.sortOptions
    .map((option) => `<option value="${option.id}">${option.label}</option>`)
    .join("");

  section.innerHTML = `
    <div class="task-controls__topline">
      <div
        class="task-controls__filters"
        role="group"
        aria-label="${config.taskControls.statusLabel}"
      >
        ${statusButtons}
      </div>

      <div class="task-controls__sort">
        <i class="fi fi-rr-sort" aria-hidden="true"></i>
        <label class="visually-hidden" for="task-sort-select">
          ${config.taskControls.sortLabel}
        </label>
        <select
          class="task-controls__sort-select"
          id="task-sort-select"
          aria-label="${config.taskControls.sortLabel}"
        >
          ${sortOptions}
        </select>
        <button
          class="task-controls__sort-direction"
          type="button"
          aria-label="${config.taskControls.reverseSortLabel}"
          aria-pressed="false"
        >
          <i class="fi fi-rr-sort-amount-up" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `;

  // Refreshes selected status, counts, and selected sort option.
  function updateControls() {
    const counts = getTaskCounts();

    section.querySelectorAll(".task-controls__button").forEach((button) => {
      const status = button.dataset.status;
      button.setAttribute("aria-pressed", String(taskView.status === status));
      button.querySelector(".task-controls__count").textContent =
        counts[status] ?? 0;
    });

    section.querySelector(".task-controls__sort-select").value = taskView.sort;

    // Reflects reversed order in both the button state and arrow direction.
    const directionButton = section.querySelector(
      ".task-controls__sort-direction",
    );
    const directionIcon = directionButton.querySelector(".fi");

    directionButton.setAttribute("aria-pressed", String(taskView.sortReversed));
    directionIcon.className = taskView.sortReversed
      ? "fi fi-rr-sort-amount-down"
      : "fi fi-rr-sort-amount-up";
  }

  // Applies the selected status filter.
  section.addEventListener("click", (event) => {
    const button = event.target.closest(".task-controls__button");
    if (button) setTaskStatus(button.dataset.status);
  });

  // Applies the selected sort order.
  section
    .querySelector(".task-controls__sort-select")
    .addEventListener("change", (event) => {
      setTaskSort(event.target.value);
    });

  // Toggles the selected sort between its normal and reversed order.
  section
    .querySelector(".task-controls__sort-direction")
    .addEventListener("click", toggleTaskSortDirection);

  updateControls();
  window.addEventListener(config.events.viewChanged, updateControls);
  window.addEventListener(config.events.tasksChanged, updateControls);

  return section;
}
