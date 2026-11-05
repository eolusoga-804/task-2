// Renders status, category, and sorting controls for the task list.
import { config } from "../../config.js";
import { tasks } from "../../state/tasks.js";
import {
  getCategoryCounts,
  getTaskCounts,
  setCategoryFilter,
  setTaskSort,
  setTaskStatus,
  taskView,
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

  const categoryButtons = config.categories
    .map(
      (category) => `
        <button
          class="task-controls__category"
          type="button"
          data-category="${category.id}"
          aria-pressed="false"
        >
          <span class="task-controls__dot task-controls__dot--${category.color}" aria-hidden="true"></span>
          <span>${category.label}</span>
          <span class="task-controls__category-count" aria-hidden="true"></span>
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

      <label class="task-controls__sort">
        <span class="visually-hidden">${config.taskControls.sortLabel}</span>
        <i class="fi fi-rr-sort" aria-hidden="true"></i>
        <select class="task-controls__sort-select">${sortOptions}</select>
      </label>
    </div>

    <div
      class="task-controls__categories"
      role="group"
      aria-label="${config.taskControls.categoryLabel}"
    >
      <button
        class="task-controls__category"
        type="button"
        data-category="all"
        aria-pressed="true"
      >
        <span>${config.taskControls.allCategoriesLabel}</span>
        <span class="task-controls__category-count" aria-hidden="true"></span>
      </button>
      ${categoryButtons}
    </div>
  `;

  // Updates selected states and task counts in the controls.
  function updateControls() {
    const statusCounts = getTaskCounts();
    const categoryCounts = getCategoryCounts();

    section.querySelectorAll(".task-controls__button").forEach((button) => {
      const status = button.dataset.status;
      button.setAttribute("aria-pressed", String(taskView.status === status));
      button.querySelector(".task-controls__count").textContent =
        statusCounts[status] ?? 0;
    });

    section.querySelectorAll(".task-controls__category").forEach((button) => {
      const categoryId = button.dataset.category;
      button.setAttribute(
        "aria-pressed",
        String(taskView.categoryId === categoryId),
      );

      button.querySelector(".task-controls__category-count").textContent =
        categoryId === "all" ? tasks.length : (categoryCounts[categoryId] ?? 0);
    });

    section.querySelector(".task-controls__sort-select").value = taskView.sort;
  }

  // Applies a clicked status or category filter.
  section.addEventListener("click", (event) => {
    const statusButton = event.target.closest(".task-controls__button");
    const categoryButton = event.target.closest(".task-controls__category");

    if (statusButton) setTaskStatus(statusButton.dataset.status);
    if (categoryButton) {
      setCategoryFilter(categoryButton.dataset.category);
    }
  });

  // Applies the selected sort order.
  section
    .querySelector(".task-controls__sort-select")
    .addEventListener("change", (event) => {
      setTaskSort(event.target.value);
    });

  // Keeps controls current when tasks or view settings change.
  updateControls();
  window.addEventListener(config.events.viewChanged, updateControls);
  window.addEventListener(config.events.tasksChanged, updateControls);

  return section;
}
