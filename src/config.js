// Keeps shared labels, categories, and app settings in one place.
export const config = {
  appName: "Tasks Manager",
  developer: "Emmanuel#804",
  storageKey: "tasks-manager-state",
  userNameKey: "tasks-manager-user-name",

  categories: [
    { id: "work", label: "Work", color: "purple" },
    { id: "personal", label: "Personal", color: "green" },
    { id: "study", label: "Study", color: "blue" },
  ],

  statusFilters: [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
  ],

  text: {
    tagline: "Organize your tasks. Build your goals. Be more productive.",
    emptyTasks: "No tasks match your filters.",
    installPrompt:
      "Install Tasks Manager for quick access and offline support.",
  },

  header: {
    searchLabel: "Search tasks",
    searchPlaceholder: "Search your tasks",
    searchShortcut: "K",
    nameLabel: "Your first name",
    namePlaceholder: "Enter your first name",
    saveName: "Continue",
    profileLabel: "Current user",
  },
};
