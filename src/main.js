// Mounts the shared header and greeting inside the app shell.
import { renderHeader } from "./components/header/header.js";
import { renderGreeting } from "./sections/greeting/greeting.js";
import { renderTaskForm } from "./sections/task-form/task-form.js";
import { renderTaskList } from "./sections/task-list/task-list.js";
import { renderTaskControls } from "./sections/task-controls/task-controls.js";
import { renderProductivity } from "./sections/productivity/productivity.js";
import { renderRecentActivity } from "./sections/recent-activity/recent-activity.js";
import "./styles/global.css";

const app = document.querySelector("#app");
const header = renderHeader();
const dashboard = document.createElement("main");

dashboard.className = "app-shell";
dashboard.id = "main-content";
dashboard.append(
  renderGreeting(),
  renderProductivity(),
  renderRecentActivity(),
  renderTaskForm(),
  renderTaskControls(),
  renderTaskList(),
);

app.replaceChildren(header, dashboard);
