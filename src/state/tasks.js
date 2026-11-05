// Loads, saves, and creates task records in browser localStorage.
import { config } from "../config.js";

export let tasks = loadFromLocalStorage();

export function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(config.storageKey);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.categoryId === "string" &&
        typeof task.completed === "boolean",
    );
  } catch {
    return [];
  }
}

export function saveToLocalStorage() {
  try {
    localStorage.setItem(config.storageKey, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

export function addTask({ title, categoryId, dueDate }) {
  const cleanTitle = title.trim();
  const validCategory = config.categories.some(
    (category) => category.id === categoryId,
  );

  if (!cleanTitle || !validCategory) return null;

  const task = {
    id: crypto.randomUUID(),
    title: cleanTitle,
    categoryId,
    dueDate: dueDate || "",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks = [task, ...tasks];

  if (!saveToLocalStorage()) {
    tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
    return null;
  }

  window.dispatchEvent(new CustomEvent("tasks:changed", { detail: tasks }));
  return task;
}
