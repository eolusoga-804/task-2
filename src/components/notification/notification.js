// Renders and controls short, accessible task notifications.
import "./notification.css";

let notificationElement;
let dismissalTimer;
let hideTimer;

export function renderNotification() {
  // Creates the live region used for task alerts.
  notificationElement = document.createElement("div");
  notificationElement.className = "app-notification";
  notificationElement.setAttribute("role", "status");
  notificationElement.setAttribute("aria-live", "polite");
  notificationElement.hidden = true;

  return notificationElement;
}

export function showNotification(message) {
  if (!notificationElement) return;

  // Replaces any current message and restarts its display timer.
  window.clearTimeout(dismissalTimer);
  window.clearTimeout(hideTimer);
  notificationElement.textContent = message;
  notificationElement.hidden = false;
  notificationElement.classList.remove("app-notification--visible");

  // Starts the entrance transition after the notification becomes visible.
  requestAnimationFrame(() => {
    notificationElement.classList.add("app-notification--visible");
  });

  // Hides the notification after a brief display.
  dismissalTimer = window.setTimeout(() => {
    notificationElement.classList.remove("app-notification--visible");
    hideTimer = window.setTimeout(() => {
      notificationElement.hidden = true;
    }, 180);
  }, 2600);
}
