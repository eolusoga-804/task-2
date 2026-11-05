// Mounts the shared header and greeting inside the app shell.
import { renderHeader } from "./components/header/header.js";
import { renderGreeting } from "./sections/greeting/greeting.js";
import { renderTaskForm } from "./sections/task-form/task-form.js";
import "./styles/global.css";

const app = document.querySelector("#app");
const header = renderHeader();
const dashboard = document.createElement("main");

dashboard.className = "app-shell";
dashboard.id = "main-content";
dashboard.append(renderGreeting(), renderTaskForm());

app.replaceChildren(header, dashboard);
