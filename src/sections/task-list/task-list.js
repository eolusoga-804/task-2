// Renders saved tasks, applies search and status filters, and handles task actions.
import { config } from "../../config.js";
import {
  deleteTask,
  tasks,
  toggleTaskCompletion,
  updateTask,
} from "../../state/tasks.js";
import { getVisibleTasks } from "../../state/task-view.js";
import "./task-list.css";

export function renderTaskList() {
  const section = document.createElement("section");
  section.className = "task-list";
  section.setAttribute("aria-labelledby", "task-list-heading");

  section.innerHTML = `
    <div class="task-list__header">
      <h2 class="task-list__heading" id="task-list-heading" tabindex="-1"></h2>
      <span class="task-list__count" aria-live="polite"></span>
    </div>

    <p class="task-list__empty"></p>
    <ol class="task-list__items"></ol>

    <dialog
      class="task-dialog"
      data-dialog="edit"
      aria-labelledby="edit-dialog-title"
    >
      <form class="task-dialog__form" data-form="edit">
        <h2 class="task-dialog__heading" id="edit-dialog-title"></h2>

        <label class="task-dialog__field">
          <span class="task-dialog__label"></span>
          <input
            class="task-dialog__input"
            name="title"
            maxlength="120"
            required
          />
        </label>

        <label class="task-dialog__field">
          <span class="task-dialog__label"></span>
          <input
            class="task-dialog__input"
            name="description"
            type="text"
            maxlength="${config.taskForm.descriptionMaxLength}"
          />
        </label>

        <label class="task-dialog__field">
          <span class="task-dialog__label"></span>
          <select
            class="task-dialog__select"
            name="categoryId"
            required
          ></select>
        </label>

        <label class="task-dialog__field">
          <span class="task-dialog__label"></span>
          <input
            class="task-dialog__input"
            name="dueDate"
            type="date"
          />
        </label>

        <p class="task-dialog__feedback" role="status"></p>

        <div class="task-dialog__actions">
          <button
            class="task-dialog__button task-dialog__button--quiet"
            type="button"
            data-close
          >
            ${config.taskActions.cancel}
          </button>
          <button class="task-dialog__button" type="submit">
            ${config.taskActions.save}
          </button>
        </div>
      </form>
    </dialog>

    <dialog
      class="task-dialog"
      data-dialog="delete"
      aria-labelledby="delete-dialog-title"
    >
      <div class="task-dialog__form">
        <h2 class="task-dialog__heading" id="delete-dialog-title"></h2>
        <p class="task-dialog__description" data-delete-title></p>
        <p class="task-dialog__feedback" data-delete-feedback role="status"></p>

        <div class="task-dialog__actions">
          <button
            class="task-dialog__button task-dialog__button--quiet"
            type="button"
            data-close
          >
            ${config.taskActions.cancel}
          </button>
          <button
            class="task-dialog__button task-dialog__button--danger"
            type="button"
            data-confirm-delete
          >
            ${config.taskActions.deleteConfirm}
          </button>
        </div>
      </div>
    </dialog>
  `;

  const heading = section.querySelector(".task-list__heading");
  const count = section.querySelector(".task-list__count");
  const empty = section.querySelector(".task-list__empty");
  const list = section.querySelector(".task-list__items");
  const editDialog = section.querySelector('[data-dialog="edit"]');
  const deleteDialog = section.querySelector('[data-dialog="delete"]');
  const editForm = section.querySelector('[data-form="edit"]');
  const editCategory = editForm.elements.categoryId;
  let pendingDeleteId = "";

  // Sets shared headings, labels, and category choices from app configuration.
  heading.textContent = config.taskList.heading;
  empty.textContent = config.taskList.emptyMessage;
  section.querySelector("#edit-dialog-title").textContent =
    config.taskActions.editHeading;
  section.querySelector("#delete-dialog-title").textContent =
    config.taskActions.deleteHeading;

  editCategory.innerHTML = config.categories
    .map(
      (category) => `<option value="${category.id}">${category.label}</option>`,
    )
    .join("");

  const editLabels = editForm.querySelectorAll(".task-dialog__label");
  editLabels[0].textContent = config.taskForm.titleLabel;
  // Assigns configured labels to each editable task field.
  editLabels[1].textContent = config.taskForm.descriptionLabel;
  editLabels[2].textContent = config.taskForm.categoryLabel;
  editLabels[3].textContent = config.taskForm.dueDateLabel;

  // Formats a date-only value in local time to avoid timezone date shifts.
  function formatDueDate(value) {
    if (!value) return config.taskList.noDueDate;

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat(config.locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  // Builds one accessible task row using text nodes for user-entered titles.
  function createTaskRow(task, animateCompletion = false) {
    const category = config.categories.find(
      (item) => item.id === task.categoryId,
    );

    if (!category) return null;

    const row = document.createElement("li");
    row.className = "task-item";
    row.dataset.taskId = task.id;

    if (task.completed) row.classList.add("task-item--completed");
    if (animateCompletion && task.completed) {
      row.classList.add("task-item--just-completed");
    }

    const checkbox = document.createElement("input");
    checkbox.className = "task-item__checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      `${task.completed ? config.taskList.markActive : config.taskList.markComplete}: ${task.title}`,
    );

    const badge = document.createElement("span");
    badge.className = `task-item__category task-item__category--${category.color}`;
    badge.textContent = category.label;

    // Groups the title and optional description in the task copy area.
    const copy = document.createElement("div");
    copy.className = "task-item__copy";

    const title = document.createElement("span");
    title.className = "task-item__title";
    title.textContent = task.title;
    copy.append(title);

    if (task.description) {
      const description = document.createElement("span");
      description.className = "task-item__description";
      description.textContent = task.description;
      copy.append(description);
    }

    const dueDate = document.createElement("time");
    dueDate.className = "task-item__due-date";
    dueDate.textContent = formatDueDate(task.dueDate);

    if (task.dueDate) dueDate.dateTime = task.dueDate;

    const actions = document.createElement("div");
    actions.className = "task-item__actions";

    const editButton = document.createElement("button");
    editButton.className = "task-item__action";
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.dataset.taskId = task.id;
    editButton.setAttribute(
      "aria-label",
      `${config.taskActions.edit}: ${task.title}`,
    );
    editButton.innerHTML = '<i class="fi fi-rr-pencil" aria-hidden="true"></i>';

    const deleteButton = document.createElement("button");
    deleteButton.className = "task-item__action";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.taskId = task.id;
    deleteButton.setAttribute(
      "aria-label",
      `${config.taskActions.delete}: ${task.title}`,
    );
    deleteButton.innerHTML =
      '<i class="fi fi-rr-trash" aria-hidden="true"></i>';

    actions.append(editButton, deleteButton);
    // Places optional description text with its task title.
    row.append(checkbox, badge, copy, dueDate, actions);

    // Saves completion state and restores the checkbox if persistence fails.
    checkbox.addEventListener("change", () => {
      const saved = toggleTaskCompletion(task.id, checkbox.checked);
      if (!saved) checkbox.checked = !checkbox.checked;
    });

    return row;
  }

  // Opens the matching task dialog and loads the selected task values.
  section.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close]");

    if (closeButton) {
      closeButton.closest("dialog").close();
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const task = tasks.find((item) => item.id === actionButton.dataset.taskId);

    if (!task) return;

    if (actionButton.dataset.action === "edit") {
      editForm.dataset.taskId = task.id;
      editForm.elements.title.value = task.title;
      // Loads an empty string for tasks created before descriptions existed.
      editForm.elements.description.value = task.description ?? "";
      editForm.elements.categoryId.value = task.categoryId;
      editForm.elements.dueDate.value = task.dueDate;
      editForm.querySelector(".task-dialog__feedback").textContent = "";
      editDialog.showModal();
    }

    if (actionButton.dataset.action === "delete") {
      pendingDeleteId = task.id;
      section.querySelector("[data-delete-title]").textContent = task.title;
      section.querySelector("[data-delete-feedback]").textContent = "";
      deleteDialog.showModal();
    }
  });

  // Saves edited task details and closes the dialog on success.
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);
    const saved = updateTask(editForm.dataset.taskId, {
      title: formData.get("title"),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      dueDate: formData.get("dueDate"),
    });

    if (!saved) {
      editForm.querySelector(".task-dialog__feedback").textContent =
        config.text.taskUpdateError;
      return;
    }

    editDialog.close();
    heading.focus();
  });

  // Deletes the selected task only after the user confirms.
  section
    .querySelector("[data-confirm-delete]")
    .addEventListener("click", () => {
      const deleted = deleteTask(pendingDeleteId);

      if (!deleted) {
        section.querySelector("[data-delete-feedback]").textContent =
          config.text.taskUpdateError;
        return;
      }

      pendingDeleteId = "";
      deleteDialog.close();
      heading.focus();
    });

  // Refreshes visible rows and counts after data or filters change.
  function updateList(event) {
    const change = event?.detail?.change;
    const changedId = event?.detail?.changedTaskId;
    const visibleTasks = getVisibleTasks();

    const rows = visibleTasks
      .map((task) =>
        createTaskRow(task, change === "completion" && task.id === changedId),
      )
      .filter(Boolean);

    list.replaceChildren(...rows);

    count.textContent = `${visibleTasks.length}${config.taskList.countSeparator}${tasks.length} ${config.taskList.countLabel}`;

    empty.textContent = tasks.length
      ? config.taskList.noMatchMessage
      : config.taskList.emptyMessage;

    empty.hidden = visibleTasks.length > 0;
    list.hidden = visibleTasks.length === 0;
  }

  // Renders initial tasks and responds to task and view-state updates.
  updateList();
  window.addEventListener(config.events.tasksChanged, updateList);
  window.addEventListener(config.events.viewChanged, updateList);

  return section;
}
