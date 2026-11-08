// Renders the responsive task form and saves submitted tasks.
import { config } from "../../config.js";
import { addTask } from "../../state/tasks.js";
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

      <label class="task-form__date-field">
        <i class="fi fi-rr-calendar" aria-hidden="true"></i>
        <span class="visually-hidden">${config.taskForm.dueDateLabel}</span>
        <input class="task-form__date" name="dueDate" type="date" />
      </label>

      <button class="task-form__submit" type="submit">
        <i class="fi fi-rr-plus task-form__submit-icon" aria-hidden="true"></i>
        <span>${config.taskForm.submitLabel}</span>
      </button>

      <p class="task-form__feedback" role="status" aria-live="polite"></p>
    </form>
  `;

  const form = section.querySelector("form");
  const titleInput = section.querySelector(".task-form__title");
  const feedback = section.querySelector(".task-form__feedback");

  // Opens the native date picker when the calendar field is clicked.
  const dateField = section.querySelector(".task-form__date-field");
  const dateInput = section.querySelector(".task-form__date");

  dateField.addEventListener("click", (event) => {
    if (event.target === dateInput) return;

    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
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

    if (!task) {
      feedback.textContent = config.text.taskSaveError;
      return;
    }

    form.reset();
    feedback.textContent = config.text.taskAdded;
    titleInput.focus();
  });

  return section;
}
