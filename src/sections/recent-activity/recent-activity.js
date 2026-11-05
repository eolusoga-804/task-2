// Displays persisted task activity with relative timestamps.
import { config } from "../../config.js";
import { activity } from "../../state/activity.js";
import "./recent-activity.css";

export function renderRecentActivity() {
  const section = document.createElement("section");
  section.className = "recent-activity";
  section.setAttribute("aria-labelledby", "recent-activity-heading");
  section.innerHTML = `
    <h2 class="recent-activity__heading" id="recent-activity-heading"></h2>
    <p class="recent-activity__empty"></p>
    <ol class="recent-activity__list"></ol>
  `;

  const list = section.querySelector(".recent-activity__list");
  const empty = section.querySelector(".recent-activity__empty");

  section.querySelector(".recent-activity__heading").textContent =
    config.activity.heading;
  empty.textContent = config.activity.emptyMessage;

  // Formats activity times in the user's locale.
  function formatRelativeTime(value) {
    const elapsedSeconds = Math.round(
      (Date.now() - new Date(value).getTime()) / 1000,
    );
    const formatter = new Intl.RelativeTimeFormat(config.locale, {
      numeric: "auto",
    });

    if (Math.abs(elapsedSeconds) < 60) {
      return formatter.format(-elapsedSeconds, "second");
    }

    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    if (Math.abs(elapsedMinutes) < 60) {
      return formatter.format(-elapsedMinutes, "minute");
    }

    const elapsedHours = Math.round(elapsedMinutes / 60);
    if (Math.abs(elapsedHours) < 24) {
      return formatter.format(-elapsedHours, "hour");
    }

    return formatter.format(-Math.round(elapsedHours / 24), "day");
  }

  // Creates a single activity row with safe text content.
  function createActivityRow(item) {
    const action = config.activity.actions[item.action];
    if (!action) return null;

    const row = document.createElement("li");
    row.className = "recent-activity__item";

    const icon = document.createElement("span");
    icon.className = "recent-activity__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = `<i class="fi ${action.icon}"></i>`;

    const content = document.createElement("div");
    content.className = "recent-activity__content";

    const label = document.createElement("span");
    label.className = "recent-activity__action";
    label.textContent = action.label;

    const title = document.createElement("span");
    title.className = "recent-activity__task";
    title.textContent = item.taskTitle;

    const time = document.createElement("time");
    time.className = "recent-activity__time";
    time.dateTime = item.occurredAt;
    time.textContent = formatRelativeTime(item.occurredAt);

    content.append(label, title, time);
    row.append(icon, content);
    return row;
  }

  // Renders the newest entries and updates the empty state.
  function updateActivity() {
    const rows = activity.map(createActivityRow).filter(Boolean);
    list.replaceChildren(...rows);
    empty.hidden = rows.length > 0;
    list.hidden = rows.length === 0;
  }

  updateActivity();
  window.addEventListener(config.events.activityChanged, updateActivity);

  return section;
}
