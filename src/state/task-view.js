// Stores task view filters and returns matching, sorted tasks.
import { config } from "../config.js";
import { tasks } from "./tasks.js";

export const taskView = {
  status: "all",
  search: "",
  categoryId: "all",
  // Keeps drag-and-drop order as the initial list order after reload.
  sort: "manual",
};

// Notifies the task list and controls when the view settings change.
function notifyViewChange() {
  window.dispatchEvent(new CustomEvent(config.events.viewChanged));
}

// Sets a configured status filter.
export function setTaskStatus(status) {
  const isKnownStatus = config.statusFilters.some(
    (filter) => filter.id === status,
  );

  if (!isKnownStatus) return;

  taskView.status = status;
  notifyViewChange();
}

// Sets the normalized task search text.
export function setTaskSearch(search) {
  taskView.search = search.trim().toLocaleLowerCase(config.locale);
  notifyViewChange();
}

// Sets a configured category filter or shows every category.
export function setCategoryFilter(categoryId) {
  const isKnownCategory =
    categoryId === "all" ||
    config.categories.some((category) => category.id === categoryId);

  if (!isKnownCategory) return;

  taskView.categoryId = categoryId;
  notifyViewChange();
}

// Sets a configured task sort order.
export function setTaskSort(sort) {
  const isKnownSort = config.sortOptions.some((option) => option.id === sort);

  if (!isKnownSort) return;

  taskView.sort = sort;
  notifyViewChange();
}

// Returns counts for the status filter buttons.
export function getTaskCounts() {
  return {
    all: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  };
}

// Returns counts for each configured category.
export function getCategoryCounts() {
  return Object.fromEntries(
    config.categories.map((category) => [
      category.id,
      tasks.filter((task) => task.categoryId === category.id).length,
    ]),
  );
}

// Filters tasks by status, search text, and category, then sorts the results.
export function getVisibleTasks() {
  const visibleTasks = tasks.filter((task) => {
    const matchesStatus =
      taskView.status === "all" ||
      (taskView.status === "active" && !task.completed) ||
      (taskView.status === "completed" && task.completed);

    const matchesCategory =
      taskView.categoryId === "all" || task.categoryId === taskView.categoryId;

    const category = config.categories.find(
      (item) => item.id === task.categoryId,
    );
    // Searches task titles, descriptions, and category names.
    const searchableText =
      `${task.title} ${task.description ?? ""} ${category?.label ?? ""}`.toLocaleLowerCase(
        config.locale,
      );

    const matchesSearch = searchableText.includes(taskView.search);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Leaves the filtered task array in its persisted order.
  if (taskView.sort === "manual") return visibleTasks;

  return [...visibleTasks].sort((first, second) => {
    if (taskView.sort === "title") {
      return first.title.localeCompare(second.title, config.locale, {
        sensitivity: "base",
      });
    }

    if (taskView.sort === "due-date") {
      if (!first.dueDate) return second.dueDate ? 1 : 0;
      if (!second.dueDate) return -1;
      return first.dueDate.localeCompare(second.dueDate);
    }

    return (second.createdAt ?? "").localeCompare(first.createdAt ?? "");
  });
}
