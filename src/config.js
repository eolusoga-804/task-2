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
    taskAdded: "Task added and saved.",
    taskSaveError:
      "This browser could not save the task. Check localStorage settings.",
    taskTitleRequired: "Enter a task title.",
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

  locale: "en-US",

  greetings: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    fallbackName: "there",
    dateLabel: "Today",
  },

  taskForm: {
    toggleLabel: "Add a task",
    titleLabel: "Task title",
    titlePlaceholder: "What do you need to do?",
    categoryLabel: "Category",
    dueDateLabel: "Due date",
    submitLabel: "Add Task",
  },

  events: {
    tasksChanged: "tasks:changed",
    viewChanged: "tasks:view-changed",
    searchChanged: "tasks:search-changed",
  },

  taskList: {
    heading: "Your tasks",
    countLabel: "tasks",
    noDueDate: "No due date",
    markComplete: "Mark task complete",
    markActive: "Mark task active",
    emptyMessage: "No tasks yet. Add one above to get started.",
    noMatchMessage: "No tasks match your search or status filter.",
    countSeparator: " / ",
  },
};
