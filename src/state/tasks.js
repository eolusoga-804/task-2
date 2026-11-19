// Loads, saves, and updates tasks while recording each successful action.
import { config } from "../config.js";
import { recordActivity } from "./activity.js";

// Capitalizes only the first letter while preserving the user's remaining casing.
function normalizeTaskTitle(title) {
  const characters = [...(typeof title === "string" ? title.trim() : "")];
  const firstLetterIndex = characters.findIndex(
    (character) =>
      character.toLocaleLowerCase(config.locale) !==
      character.toLocaleUpperCase(config.locale),
  );

  if (firstLetterIndex < 0) return characters.join("");

  characters[firstLetterIndex] = characters[firstLetterIndex].toLocaleUpperCase(
    config.locale,
  );

  return characters.join("");
}

export let tasks = loadFromLocalStorage();

// Loads valid task records from localStorage.
export function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(config.storageKey);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    // Normalizes existing saved task titles when loading them into the UI.
    return parsed
      .filter(
        (task) =>
          task &&
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          typeof task.categoryId === "string" &&
          typeof task.completed === "boolean",
      )
      .map((task) => ({
        ...task,
        title: normalizeTaskTitle(task.title),
      }));
  } catch {
    return [];
  }
}

// Saves the current task collection and reports storage success.
export function saveToLocalStorage() {
  try {
    localStorage.setItem(config.storageKey, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

// Creates and persists a task in the selected category.
export function addTask({ title, description, categoryId, dueDate }) {
  // Capitalizes the first letter of newly created task titles.
  const cleanTitle = normalizeTaskTitle(title);

  // Trims the optional description while allowing it to be empty.
  const cleanDescription =
    typeof description === "string" ? description.trim() : "";
  const validCategory = config.categories.some(
    (category) => category.id === categoryId,
  );

  if (!cleanTitle || !validCategory) return null;

  const createdAt = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    title: cleanTitle,
    description: cleanDescription,
    categoryId,
    dueDate: dueDate || "",
    completed: false,
    createdAt,
    updatedAt: createdAt,
  };

  const previousTasks = tasks;
  tasks = [task, ...tasks];

  if (!saveToLocalStorage()) {
    tasks = previousTasks;
    return null;
  }

  recordActivity("created", task);

  window.dispatchEvent(
    new CustomEvent(config.events.tasksChanged, {
      detail: { tasks, changedTaskId: task.id, change: "created" },
    }),
  );

  return task;
}

// Changes a task's completion state and records the action.
export function toggleTaskCompletion(id, completed) {
  const previousTasks = tasks;
  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) return false;

  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, completed, updatedAt: new Date().toISOString() }
      : task,
  );

  if (!saveToLocalStorage()) {
    tasks = previousTasks;
    return false;
  }

  const changedTask = tasks.find((task) => task.id === id);
  recordActivity(completed ? "completed" : "reopened", changedTask);

  window.dispatchEvent(
    new CustomEvent(config.events.tasksChanged, {
      detail: { tasks, changedTaskId: id, change: "completion" },
    }),
  );

  return true;
}

// Updates a task's title, category, or due date.
export function updateTask(id, changes) {
  const previousTasks = tasks;
  const existingTask = tasks.find((task) => task.id === id);

  // Applies the same first-letter capitalization when editing a title.
  const title = normalizeTaskTitle(changes?.title);

  // Keeps an omitted or blank description optional when editing older tasks.
  const description =
    typeof changes?.description === "string" ? changes.description.trim() : "";
  const categoryId = changes?.categoryId;
  const validCategory = config.categories.some(
    (category) => category.id === categoryId,
  );

  if (!existingTask || !title || !validCategory) return false;

  tasks = tasks.map((task) =>
    task.id === id
      ? {
          ...task,
          title,
          description,
          categoryId,
          dueDate: typeof changes.dueDate === "string" ? changes.dueDate : "",
          updatedAt: new Date().toISOString(),
        }
      : task,
  );

  if (!saveToLocalStorage()) {
    tasks = previousTasks;
    return false;
  }

  recordActivity(
    "updated",
    tasks.find((task) => task.id === id),
  );

  window.dispatchEvent(
    new CustomEvent(config.events.tasksChanged, {
      detail: { tasks, changedTaskId: id, change: "updated" },
    }),
  );

  return true;
}

// Deletes a task and records its title in recent activity.
export function deleteTask(id) {
  const previousTasks = tasks;
  const existingTask = tasks.find((task) => task.id === id);

  if (!existingTask) return false;

  tasks = tasks.filter((task) => task.id !== id);

  if (!saveToLocalStorage()) {
    tasks = previousTasks;
    return false;
  }

  recordActivity("deleted", existingTask);

  window.dispatchEvent(
    new CustomEvent(config.events.tasksChanged, {
      detail: { tasks, changedTaskId: id, change: "deleted" },
    }),
  );

  return true;
}

// Moves a task before or after another task and saves the new array order.
export function reorderTasks(sourceId, targetId, insertAfter = false) {
  if (!sourceId || !targetId || sourceId === targetId) return false;

  const sourceIndex = tasks.findIndex((task) => task.id === sourceId);
  const targetIndex = tasks.findIndex((task) => task.id === targetId);

  if (sourceIndex < 0 || targetIndex < 0) return false;

  const previousTasks = tasks;
  const reorderedTasks = [...tasks];
  const [movedTask] = reorderedTasks.splice(sourceIndex, 1);
  const nextTargetIndex = reorderedTasks.findIndex(
    (task) => task.id === targetId,
  );

  if (nextTargetIndex < 0) return false;

  reorderedTasks.splice(nextTargetIndex + (insertAfter ? 1 : 0), 0, movedTask);

  tasks = reorderedTasks;

  if (!saveToLocalStorage()) {
    tasks = previousTasks;
    return false;
  }

  return true;
}
