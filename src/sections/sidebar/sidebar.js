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

  // Pairs each sidebar section with its configured Flaticon icon.
  const panels = [
    {
      section: renderProductivity(),
      icon: config.taskControls.panelIcons.productivity,
    },
    {
      section: renderCategoryFilters(),
      icon: config.taskControls.panelIcons.categories,
    },
    {
      section: renderRecentActivity(),
      icon: config.taskControls.panelIcons.recentActivity,
    },
  ];

  // Tracks the desktop breakpoint and the panel disclosures it controls.
  const desktopQuery = window.matchMedia("(min-width: 880px)");
  const panelDetails = [];

  // Adds matching icons to mobile summaries and visible panel headings.
  panels.forEach(({ section: panel, icon }) => {
    const heading = panel.querySelector("h2");
    const headingText = heading.textContent;

    // Adds the panel icon to its visible heading on wider screens.
    const sectionIcon = document.createElement("i");
    sectionIcon.className = `fi ${icon} sidebar__section-icon`;
    sectionIcon.setAttribute("aria-hidden", "true");
    heading.prepend(sectionIcon);

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const label = document.createElement("span");

    // Adds the panel icon to the collapsible heading on smaller screens.
    const summaryIcon = document.createElement("i");
    summaryIcon.className = `fi ${icon} sidebar__icon`;
    summaryIcon.setAttribute("aria-hidden", "true");

    const chevron = document.createElement("i");

    details.className = "sidebar__panel";

    // Opens sidebar content by default when the desktop layout is active.
    details.open = desktopQuery.matches;
    panelDetails.push(details);

    summary.className = "sidebar__summary";
    label.className = "sidebar__summary-label";
    label.textContent = headingText;

    chevron.className = "fi fi-rr-angle-small-down sidebar__chevron";
    chevron.setAttribute("aria-hidden", "true");

    // Keeps the icon and label before the disclosure chevron.
    summary.append(summaryIcon, label, chevron);

    heading.classList.add("sidebar__section-heading");
    details.append(summary, panel);
    aside.append(details);
  });

  // Remembers compact accordion states while desktop panels are expanded.
  const compactOpenStates = panelDetails.map(() => false);

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      panelDetails.forEach((details, index) => {
        compactOpenStates[index] = details.open;
        details.open = true;
      });
      return;
    }

    // Restores each panel's previous compact state when returning from desktop.
    panelDetails.forEach((details, index) => {
      details.open = compactOpenStates[index];
    });
  });

  return aside;
}
