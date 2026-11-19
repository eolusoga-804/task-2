// Renders and controls short, accessible task notifications.
import "./notification.css";

let notificationBackdrop;
let notificationElement;
let dismissalTimer;
let hideTimer;

export function renderNotification() {
  // Creates a full-screen layer that blurs the interface behind the alert.
  notificationBackdrop = document.createElement("div");
  notificationBackdrop.className = "app-notification-backdrop";
  notificationBackdrop.hidden = true;

  // Creates the centered live region that displays the task message.
  notificationElement = document.createElement("div");
  notificationElement.className = "app-notification";
  notificationElement.setAttribute("role", "status");
  notificationElement.setAttribute("aria-live", "polite");
  notificationBackdrop.append(notificationElement);

  return notificationBackdrop;
}

export function showNotification(message) {
  if (!notificationElement || !notificationBackdrop) return;

  // Replaces the current message and restarts its display timer.
  window.clearTimeout(dismissalTimer);
  window.clearTimeout(hideTimer);
  notificationElement.textContent = message;
  notificationBackdrop.hidden = false;
  notificationBackdrop.classList.remove("app-notification-backdrop--visible");

  // Starts the backdrop and popup entrance transitions after display.
  requestAnimationFrame(() => {
    notificationBackdrop.classList.add("app-notification-backdrop--visible");
  });

  // Fades the popup and blurred backdrop out after a short delay.
  dismissalTimer = window.setTimeout(() => {
    notificationBackdrop.classList.remove("app-notification-backdrop--visible");
    hideTimer = window.setTimeout(() => {
      notificationBackdrop.hidden = true;
    }, 180);
  }, 2600);
}
