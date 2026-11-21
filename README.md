# Tasks Manager

Tasks Manager is a responsive task management and productivity tracking application. It helps users organize tasks, track deadlines, and monitor completion progress in one place.

The app runs in the browser and stores task data locally. It does not require an account, API, or application server.

**Live application:** [https://task-2-xi-red.vercel.app/](https://task-2-xi-red.vercel.app/)

## Features

### Task management

- Create, view, edit, complete, reorder, and delete tasks
- Assign tasks to Work, Personal, or Study categories
- Add optional descriptions and due dates
- See an overdue label on active tasks whose due date has passed
- Review a short popup after adding, editing, or deleting a task
- See before-and-after values for fields changed during an edit

### Search, filters, and sorting

- Search task titles, descriptions, and category names
- Filter tasks by All, Active, or Completed status
- Filter tasks by category
- Sort tasks manually, by title, due date, or creation date
- Reverse the selected sort order
- Reorder tasks with drag and drop or keyboard controls

### Productivity and activity

- View a circular task completion progress indicator
- See task counts by status and category
- Review recent task activity
- Receive animated feedback when completing a task

### Responsive interface

- Use the app on phone, tablet, and desktop screen sizes
- Collapse productivity, category, and activity panels on smaller screens
- Keep task entry and filtering controls accessible while scrolling on tablet and larger layouts
- Use keyboard-accessible controls and visible focus states
- Respect the device’s reduced-motion preference

### Installable app

Tasks Manager includes a web app manifest and service worker for installation on supported browsers and devices. The app can be added to a device’s home screen or installed as a desktop app where the browser supports installation.

## Technology

- Vanilla JavaScript with ES modules
- Vite
- CSS
- Browser `localStorage`
- Progressive Web App manifest and service worker

## Run Locally

### Prerequisites

Install a current version of [Node.js](https://nodejs.org/), which includes npm.

### Install project dependencies

```cmd
npm install
```

### Start the development server

```cmd
npm run dev
```

Open the local development URL printed in the terminal.

### Build the production version

```cmd
npm run build
```

Vite writes the production build to the `dist/` directory.

### Preview the production build locally

```cmd
npm run preview
```

## Data Storage

Tasks and recent activity are stored in the browser’s `localStorage` on the current device and browser. No task data is sent to a backend, and data does not automatically sync between devices.

The saved data remains available after a page reload. Clearing the browser’s site data removes the locally stored tasks and activity.

## Project Structure

```text
src/
├── components/
│   ├── footer/
│   ├── header/
│   ├── install-prompt/
│   └── notification/
├── sections/
│   ├── category-filters/
│   ├── greeting/
│   ├── productivity/
│   ├── recent-activity/
│   ├── sidebar/
│   ├── task-controls/
│   ├── task-form/
│   └── task-list/
├── state/
│   ├── activity.js
│   ├── preferences.js
│   ├── task-view.js
│   └── tasks.js
├── config.js
├── main.js
└── styles/
    └── global.css
```

The app is organized into components and sections. Task data, view state, user preferences, and activity history are managed in separate modules. Shared labels, categories, and settings are centralized in `src/config.js`.

## Deployment

The project can be deployed to Vercel as a static Vite application.

Typical Vercel build settings:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

Connect the GitHub repository to Vercel. New commits pushed to the configured deployment branch can trigger a new deployment.

## Credits

Designed and developed by **Emmanuel#804**.
