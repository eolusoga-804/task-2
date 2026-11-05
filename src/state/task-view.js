// Stores the current search and status filter for the task list.
import { config } from "../config.js";
import { tasks } from "./tasks.js";

export const taskView = {
  status: "all",
  search: "",
};

function notifyViewChange() {
  window.dispatchEvent(new CustomEvent(config.events.viewChanged));
}

// Updates the active status filter when it matches a configured option.
export function setTaskStatus(status) {
  const isKnownStatus = config.statusFilters.some(
    (filter) => filter.id === status,
  );
  if (!isKnownStatus) return;

  taskView.status = status;
  notifyViewChange();
}

// Updates search state and notifies the task list.
export function setTaskSearch(search) {
  taskView.search = search.trim().toLocaleLowerCase(config.locale);
  window.dispatchEvent(new CustomEvent(config.events.searchChanged));
  notifyViewChange();
}

// Returns task counts for the status filter buttons.
export function getTaskCounts() {
  return {
    all: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  };
}

// Applies the active status and text search to saved tasks.
export function getVisibleTasks() {
  return tasks.filter((task) => {
    const matchesStatus =
      taskView.status === "all" ||
      (taskView.status === "active" && !task.completed) ||
      (taskView.status === "completed" && task.completed);

    const category = config.categories.find(
      (item) => item.id === task.categoryId,
    );
    const searchableText =
      `${task.title} ${category?.label ?? ""}`.toLocaleLowerCase(config.locale);
    const matchesSearch = searchableText.includes(taskView.search);

    return matchesStatus && matchesSearch;
  });
}
