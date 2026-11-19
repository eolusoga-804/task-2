// Renders the responsive task form and saves submitted tasks.
import { config } from "../../config.js";
import { addTask } from "../../state/tasks.js";
// Loads the popup used for successful task creation.
import { showNotification } from "../../components/notification/notification.js";
import "./task-form.css";

export function renderTaskForm() {
  const section = document.createElement("details");
  section.className = "task-form";
  // Starts the task form open on every page load.
  section.open = true;

  const categoryOptions = config.categories
    .map(
      (category) => `<option value="${category.id}">${category.label}</option>`,
    )
    .join("");

  section.innerHTML = `
    <summary class="task-form__summary">
      <i class="fi fi-rr-plus" aria-hidden="true"></i>
      <span>${config.taskForm.toggleLabel}</span>
      <i class="fi fi-rr-angle-small-down task-form__chevron" aria-hidden="true"></i>
    </summary>

    <form class="task-form__fields">
      <label class="task-form__title-field">
        <span class="visually-hidden">${config.taskForm.titleLabel}</span>
        <i class="fi fi-rr-plus task-form__title-icon" aria-hidden="true"></i>
        <input
          class="task-form__title"
          name="title"
          type="text"
          maxlength="120"
          placeholder="${config.taskForm.titlePlaceholder}"
          required
        />
      </label>

      <label class="task-form__description-field">
        <span class="visually-hidden">${config.taskForm.descriptionLabel}</span>
        <input
          class="task-form__description"
          name="description"
          type="text"
          maxlength="${config.taskForm.descriptionMaxLength}"
          placeholder="${config.taskForm.descriptionPlaceholder}"
        />
      </label>

      <label class="task-form__category-field">
        <span class="visually-hidden">${config.taskForm.categoryLabel}</span>
        <select class="task-form__category" name="categoryId" required>
          ${categoryOptions}
        </select>
      </label>

      <div class="task-form__date-field">
        <button
          class="task-form__date-button"
          type="button"
          aria-label="${config.taskForm.dueDateLabel}"
        >
          <i class="fi fi-rr-calendar" aria-hidden="true"></i>
        </button>
        <input
          class="task-form__date"
          name="dueDate"
          type="date"
          tabindex="-1"
          aria-hidden="true"
        />
      </div>

      <button class="task-form__submit" type="submit">
        <i class="fi fi-rr-plus task-form__submit-icon" aria-hidden="true"></i>
        <span>${config.taskForm.submitLabel}</span>
      </button>
    </form>
  `;

  const form = section.querySelector("form");
  const titleInput = section.querySelector(".task-form__title");

  // Opens the picker from one button and returns focus there after selection.
  const dateButton = section.querySelector(".task-form__date-button");
  const dateInput = section.querySelector(".task-form__date");

  dateButton.addEventListener("click", () => {
    if (typeof dateInput.showPicker === "function") {
      try {
        dateInput.showPicker();
      } catch {
        dateInput.click();
      }
    } else {
      dateInput.click();
    }
  });

  // Keeps keyboard navigation on the single calendar button after a date is chosen.
  dateInput.addEventListener("change", () => {
    dateButton.focus();
  });

  // Validates and saves the task, then resets the form on success.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    if (!title) {
      titleInput.setCustomValidity(config.text.taskTitleRequired);
      titleInput.reportValidity();
      titleInput.setCustomValidity("");
      return;
    }

    const formData = new FormData(form);
    const task = addTask({
      title,
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      dueDate: formData.get("dueDate"),
    });

    // Reports a failed save through the popup after removing inline feedback.
    if (!task) {
      showNotification(config.text.taskSaveError);
      return;
    }

    form.reset();

    showNotification(config.text.taskAdded);

    titleInput.focus();
  });

  return section;
}
