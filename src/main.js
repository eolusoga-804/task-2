// Mounts the fixed header, greeting, sidebar, and task workspace.
import { renderHeader } from "./components/header/header.js";
import { renderGreeting } from "./sections/greeting/greeting.js";
import { renderSidebar } from "./sections/sidebar/sidebar.js";
import { renderTaskForm } from "./sections/task-form/task-form.js";
import { renderTaskControls } from "./sections/task-controls/task-controls.js";
import { renderTaskList } from "./sections/task-list/task-list.js";
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

taskWorkspace.append(renderTaskForm(), renderTaskControls(), renderTaskList());

dashboard.append(greeting, sidebar, taskWorkspace);
app.replaceChildren(header, dashboard);
