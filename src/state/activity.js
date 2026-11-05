// Loads and saves a short history of task changes.
import { config } from "../config.js";

export let activity = loadActivity();

function loadActivity() {
  try {
    const saved = localStorage.getItem(config.activityStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.action === "string" &&
        typeof item.taskTitle === "string" &&
        typeof item.occurredAt === "string" &&
        config.activity.actions[item.action],
    );
  } catch {
    return [];
  }
}

// Persists a task action and notifies the activity panel.
export function recordActivity(action, task) {
  if (!config.activity.actions[action] || !task) return;

  const entry = {
    id: crypto.randomUUID(),
    action,
    taskTitle: task.title,
    occurredAt: new Date().toISOString(),
  };

  activity = [entry, ...activity].slice(0, config.activity.maximumItems);

  try {
    localStorage.setItem(config.activityStorageKey, JSON.stringify(activity));
  } catch {
    // Keeps the activity visible for this page session when storage is unavailable.
  }

  window.dispatchEvent(
    new CustomEvent(config.events.activityChanged, { detail: activity }),
  );
}
