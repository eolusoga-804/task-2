// Renders the responsive task form and saves submitted tasks.
import { config } from "../../config.js";
import { addTask } from "../../state/tasks.js";
import "./task-form.css";

export function renderTaskForm() {
  const section = document.createElement("details");
  section.className = "task-form";
  section.open = window.matchMedia("(min-width: 700px)").matches;

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
        <span>${config.taskForm.submitLabel}</span>
        <i class="fi fi-rr-angle-small-right" aria-hidden="true"></i>
      </button>

      <p class="task-form__feedback" role="status" aria-live="polite"></p>
    </form>
  `;

  const form = section.querySelector("form");
  const titleInput = section.querySelector(".task-form__title");
  const feedback = section.querySelector(".task-form__feedback");

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
