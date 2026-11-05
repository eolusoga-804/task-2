// Renders category filters with live task counts.
import { config } from "../../config.js";
import { tasks } from "../../state/tasks.js";
import {
  getCategoryCounts,
  setCategoryFilter,
  taskView,
} from "../../state/task-view.js";
import "./category-filters.css";

export function renderCategoryFilters() {
  const section = document.createElement("section");
  section.className = "category-filters";
  section.setAttribute("aria-labelledby", "category-filters-heading");

  const categoryButtons = config.categories
    .map(
      (category) => `
        <button
          class="category-filters__button"
          type="button"
          data-category="${category.id}"
          aria-pressed="false"
        >
          <span class="category-filters__dot category-filters__dot--${category.color}" aria-hidden="true"></span>
          <span>${category.label}</span>
          <span class="category-filters__count" aria-hidden="true"></span>
        </button>
      `,
    )
    .join("");

  section.innerHTML = `
    <h2 class="category-filters__heading" id="category-filters-heading"></h2>
    <div class="category-filters__list" role="group" aria-label="${config.taskControls.categoryLabel}">
      <button
        class="category-filters__button"
        type="button"
        data-category="all"
        aria-pressed="true"
      >
        <span class="category-filters__all-dot" aria-hidden="true"></span>
        <span>${config.taskControls.allCategoriesLabel}</span>
        <span class="category-filters__count" aria-hidden="true"></span>
      </button>
      ${categoryButtons}
    </div>
  `;

  section.querySelector(".category-filters__heading").textContent =
    config.taskControls.categoryHeading;

  // Updates active category styling and counts when tasks or filters change.
  function updateFilters() {
    const categoryCounts = getCategoryCounts();

    section.querySelectorAll(".category-filters__button").forEach((button) => {
      const categoryId = button.dataset.category;
      button.setAttribute(
        "aria-pressed",
        String(taskView.categoryId === categoryId),
      );

      button.querySelector(".category-filters__count").textContent =
        categoryId === "all" ? tasks.length : (categoryCounts[categoryId] ?? 0);
    });
  }

  // Applies the clicked category filter to the task view.
  section.addEventListener("click", (event) => {
    const button = event.target.closest(".category-filters__button");
    if (button) setCategoryFilter(button.dataset.category);
  });

  updateFilters();
  window.addEventListener(config.events.viewChanged, updateFilters);
  window.addEventListener(config.events.tasksChanged, updateFilters);

  return section;
}
