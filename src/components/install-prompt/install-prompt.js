// Shows a first-visit install prompt and uses the browser install event when available.
import { config } from "../../config.js";
import { getUserName } from "../../state/preferences.js";
import "./install-prompt.css";

export function renderInstallPrompt() {
  const dialog = document.createElement("dialog");
  dialog.className = "install-prompt";
  dialog.setAttribute("aria-labelledby", "install-prompt-heading");
  dialog.innerHTML = `
    <div class="install-prompt__content">
      <span class="install-prompt__icon" aria-hidden="true">
        <i class="fi fi-rr-download"></i>
      </span>
      <div class="install-prompt__copy">
        <h2 class="install-prompt__heading" id="install-prompt-heading"></h2>
        <p class="install-prompt__description"></p>
      </div>
    </div>
    <p class="install-prompt__instructions" hidden></p>
    <div class="install-prompt__actions">
      <button class="install-prompt__button install-prompt__button--quiet" data-close type="button"></button>
      <button class="install-prompt__button install-prompt__button--guide" data-guide type="button"></button>
      <button class="install-prompt__button" data-install type="button"></button>
    </div>
  `;

  const description = dialog.querySelector(".install-prompt__description");
  const instructions = dialog.querySelector(".install-prompt__instructions");
  const closeButton = dialog.querySelector("[data-close]");
  const guideButton = dialog.querySelector("[data-guide]");
  const installButton = dialog.querySelector("[data-install]");
  let deferredPrompt = null;

  dialog.querySelector(".install-prompt__heading").textContent =
    config.installPrompt.heading;
  description.textContent = config.installPrompt.description;
  closeButton.textContent = config.installPrompt.closeLabel;
  guideButton.textContent = config.installPrompt.guideLabel;
  installButton.textContent = config.installPrompt.installLabel;

  installButton.hidden = true;

  // Stores that the first-visit prompt has already been handled.
  function markPromptSeen() {
    try {
      localStorage.setItem(config.installPrompt.storageKey, "true");
    } catch {
      // The prompt remains usable when browser storage is unavailable.
    }
  }

  // Opens the prompt once, after the name dialog is complete if needed.
  function showPrompt() {
    if (
      dialog.open ||
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return;
    }

    try {
      if (localStorage.getItem(config.installPrompt.storageKey)) return;
    } catch {
      // Continues without the once-only preference when storage is unavailable.
    }

    dialog.showModal();
  }

  // Captures the browser's native installation prompt when supported.
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.hidden = false;
    guideButton.hidden = true;
  });

  // Starts installation from the user's explicit button press.
  installButton.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    markPromptSeen();
    dialog.close();
  });

  // Reveals manual install directions on browsers without a native prompt.
  guideButton.addEventListener("click", () => {
    instructions.textContent = config.installPrompt.instructions;
    instructions.hidden = false;
    guideButton.hidden = true;
  });

  // Dismisses the prompt and records the choice.
  closeButton.addEventListener("click", () => {
    markPromptSeen();
    dialog.close();
  });

  // Waits for onboarding on a new profile, then shows the install prompt.
  if (getUserName()) {
    requestAnimationFrame(showPrompt);
  } else {
    window.addEventListener(config.events.userNameSaved, showPrompt, {
      once: true,
    });
  }

  return dialog;
}
