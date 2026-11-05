// Groups productivity, categories, and activity into responsive sidebar panels.
import { config } from "../../config.js";
import { renderProductivity } from "../productivity/productivity.js";
import { renderCategoryFilters } from "../category-filters/category-filters.js";
import { renderRecentActivity } from "../recent-activity/recent-activity.js";
import "./sidebar.css";

export function renderSidebar() {
  const aside = document.createElement("aside");
  aside.className = "dashboard__sidebar";
  aside.setAttribute("aria-label", config.taskControls.sidebarLabel);

  const panels = [
    renderProductivity(),
    renderCategoryFilters(),
    renderRecentActivity(),
  ];

  // Wraps each sidebar section in a disclosure that opens by default on desktop.
  panels.forEach((panel) => {
    const heading = panel.querySelector("h2");
    const headingText = heading.textContent;
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const label = document.createElement("span");
    const chevron = document.createElement("i");

    details.className = "sidebar__panel";
    details.open = window.matchMedia("(min-width: 760px)").matches;

    summary.className = "sidebar__summary";
    label.className = "sidebar__summary-label";
    label.textContent = headingText;

    chevron.className = "fi fi-rr-angle-small-down sidebar__chevron";
    chevron.setAttribute("aria-hidden", "true");

    summary.append(label, chevron);
    heading.classList.add("sidebar__section-heading");
    details.append(summary, panel);
    aside.append(details);
  });

  return aside;
}
