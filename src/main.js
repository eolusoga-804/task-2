// Loads the shared configuration and mounts the application shell.
import { config } from "./config.js";
import "./styles/global.css";

document.querySelector("#app").innerHTML = `
  <main class="app-shell" aria-labelledby="app-title">
    <h1 id="app-title">${config.appName}</h1>
    <p class="app-shell__status" role="status">
      ${config.text.tagline}
    </p>
  </main>
`;
