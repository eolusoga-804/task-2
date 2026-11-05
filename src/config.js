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
    taskUpdated: "Task updated and saved.",
    taskDeleted: "Task deleted.",
    taskUpdateError: "This browser could not save your changes.",
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
    activityChanged: "tasks:activity-changed",
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

  taskActions: {
    edit: "Edit task",
    delete: "Delete task",
    editHeading: "Edit task",
    deleteHeading: "Delete this task?",
    deleteConfirm: "Delete task",
    save: "Save changes",
    cancel: "Cancel",
  },

  taskControls: {
    statusLabel: "Filter tasks by status",
    categoryLabel: "Filter tasks by category",
    allCategoriesLabel: "All categories",
    sortLabel: "Sort tasks",
  },

  sortOptions: [
    { id: "newest", label: "Newest" },
    { id: "due-date", label: "Due date" },
    { id: "title", label: "Title" },
  ],

  productivity: {
    heading: "Productivity",
    progressLabel: "Task completion progress",
    completedLabel: "tasks completed",
    emptyMessage: "Add your first task to begin.",
    steadyMessage: "Keep going! You’re making progress.",
    strongMessage: "Nice work! Keep your momentum.",
    completeMessage: "Excellent work. All tasks are complete.",
    steadyThreshold: 40,
    strongThreshold: 75,
  },

  activityStorageKey: "tasks-manager-activity",

  activity: {
    heading: "Recent Activity",
    emptyMessage: "Your task activity will appear here.",
    maximumItems: 12,
    actions: {
      created: { label: "Added task", icon: "fi-rr-plus" },
      completed: { label: "Completed", icon: "fi-rr-check" },
      reopened: { label: "Reopened", icon: "fi-rr-undo" },
      updated: { label: "Updated task", icon: "fi-rr-pencil" },
      deleted: { label: "Deleted task", icon: "fi-rr-trash" },
    },
  },
};
