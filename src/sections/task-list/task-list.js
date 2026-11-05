// Renders saved tasks and handles completion changes.
import { config } from "../../config.js";
import { tasks, toggleTaskCompletion } from "../../state/tasks.js";
import "./task-list.css";

export function renderTaskList() {
  const section = document.createElement("section");
  section.className = "task-list";
  section.setAttribute("aria-labelledby", "task-list-heading");
  section.innerHTML = `
    <div class="task-list__header">
      <h2 class="task-list__heading" id="task-list-heading"></h2>
      <span class="task-list__count" aria-live="polite"></span>
    </div>
    <p class="task-list__empty"></p>
    <ol class="task-list__items"></ol>
  `;

  const heading = section.querySelector(".task-list__heading");
  const count = section.querySelector(".task-list__count");
  const empty = section.querySelector(".task-list__empty");
  const list = section.querySelector(".task-list__items");

  heading.textContent = config.taskList.heading;
  empty.textContent = config.taskList.emptyMessage;

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

  // Builds each task row using text nodes for user-provided task titles.
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

    const title = document.createElement("span");
    title.className = "task-item__title";
    title.textContent = task.title;

    const dueDate = document.createElement("time");
    dueDate.className = "task-item__due-date";
    dueDate.textContent = formatDueDate(task.dueDate);
    if (task.dueDate) dueDate.dateTime = task.dueDate;

    checkbox.addEventListener("change", () => {
      const saved = toggleTaskCompletion(task.id, checkbox.checked);
      if (!saved) checkbox.checked = !checkbox.checked;
    });

    row.append(checkbox, badge, title, dueDate);
    return row;
  }

  // Refreshes the visible rows after task creation or completion changes.
  function updateList(event) {
    const change = event?.detail?.change;
    const changedId = event?.detail?.changedTaskId;
    const rows = tasks
      .map((task) =>
        createTaskRow(task, change === "completion" && task.id === changedId),
      )
      .filter(Boolean);

    list.replaceChildren(...rows);
    count.textContent = `${tasks.length} ${config.taskList.countLabel}`;
    empty.hidden = tasks.length > 0;
    list.hidden = tasks.length === 0;
  }

  updateList();
  window.addEventListener(config.events.tasksChanged, updateList);

  return section;
}
