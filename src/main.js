// Mounts the fixed header, greeting, sidebar, and task workspace.
import { renderHeader } from "./components/header/header.js";
import { renderGreeting } from "./sections/greeting/greeting.js";
import { renderSidebar } from "./sections/sidebar/sidebar.js";
import { renderTaskForm } from "./sections/task-form/task-form.js";
import { renderTaskControls } from "./sections/task-controls/task-controls.js";
import { renderTaskList } from "./sections/task-list/task-list.js";
import { renderFooter } from "./components/footer/footer.js";
import { renderInstallPrompt } from "./components/install-prompt/install-prompt.js";
import "./styles/global.css";

const app = document.querySelector("#app");
const header = renderHeader();
const dashboard = document.createElement("main");
const greeting = renderGreeting();
const sidebar = renderSidebar();
const taskWorkspace = document.createElement("div");

dashboard.className = "app-shell dashboard";
dashboard.id = "main-content";
greeting.classList.add("dashboard__greeting");
taskWorkspace.className = "dashboard__main";

// Groups task entry and filtering controls so they can stick together.
const taskToolbar = document.createElement("div");
taskToolbar.className = "dashboard__task-toolbar";
taskToolbar.append(renderTaskForm(), renderTaskControls());

taskWorkspace.append(taskToolbar, renderTaskList());

dashboard.append(greeting, sidebar, taskWorkspace);

const footer = renderFooter();
const installPrompt = renderInstallPrompt();

app.replaceChildren(header, dashboard, footer, installPrompt);

// Keeps the fixed desktop sidebar above the footer as the page scrolls.
let sidebarUpdateQueued = false;

function updateSidebarClearance() {
  if (window.innerWidth < 880) {
    sidebar.style.removeProperty("max-height");
    return;
  }

  const sidebarTop = sidebar.getBoundingClientRect().top;
  const footerTop = footer.getBoundingClientRect().top;
  const viewportLimit = window.innerHeight - 168;
  const footerLimit = footerTop - sidebarTop - 16;
  const availableHeight = Math.max(0, Math.min(viewportLimit, footerLimit));

  sidebar.style.maxHeight = `${availableHeight}px`;
}

// Coalesces scroll and resize updates into one frame.
function scheduleSidebarUpdate() {
  if (sidebarUpdateQueued) return;

  sidebarUpdateQueued = true;
  requestAnimationFrame(() => {
    sidebarUpdateQueued = false;
    updateSidebarClearance();
  });
}

window.addEventListener("scroll", scheduleSidebarUpdate, { passive: true });
window.addEventListener("resize", scheduleSidebarUpdate);
scheduleSidebarUpdate();

// Registers the offline app shell in production builds.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
