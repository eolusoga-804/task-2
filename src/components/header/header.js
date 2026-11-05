// Renders the fixed app header and first-visit name setup dialog.
import { config } from "../../config.js";
import { getUserName, saveUserName } from "../../state/preferences.js";
import "./header.css";

export function renderHeader() {
  const header = document.createElement("header");
  header.className = "app-header";
  header.innerHTML = `
    <div class="app-header__inner">
      <a class="app-header__brand" href="/" aria-label="${config.appName} home">
        <span class="app-header__brand-title">${config.appName}</span>
        <span class="app-header__brand-caption">${config.developer}</span>
      </a>

      <label class="app-header__search">
        <i class="fi fi-rr-search" aria-hidden="true"></i>
        <span class="visually-hidden">${config.header.searchLabel}</span>
        <input
          class="app-header__search-input"
          type="search"
          placeholder="${config.header.searchPlaceholder}"
          autocomplete="off"
        />
        <kbd class="app-header__shortcut" aria-hidden="true">${config.header.searchShortcut}</kbd>
      </label>

      <div class="app-header__profile" aria-label="${config.header.profileLabel}">
        <span class="app-header__avatar" aria-hidden="true"></span>
        <span class="app-header__name"></span>
      </div>
    </div>

    <dialog class="name-dialog" aria-labelledby="name-dialog-title">
      <form class="name-dialog__form">
        <span class="name-dialog__eyebrow">${config.appName}</span>
        <h2 class="name-dialog__title" id="name-dialog-title">What should we call you?</h2>
        <p class="name-dialog__description">Your name will appear with your daily greeting.</p>
        <label class="name-dialog__label" for="name-dialog-input">${config.header.nameLabel}</label>
        <input
          class="name-dialog__input"
          id="name-dialog-input"
          name="firstName"
          type="text"
          placeholder="${config.header.namePlaceholder}"
          autocomplete="given-name"
          maxlength="40"
          required
        />
        <button class="name-dialog__submit" type="submit">${config.header.saveName}</button>
      </form>
    </dialog>
  `;

  const nameElement = header.querySelector(".app-header__name");
  const avatarElement = header.querySelector(".app-header__avatar");
  const dialog = header.querySelector(".name-dialog");
  const nameInput = header.querySelector(".name-dialog__input");
  const searchInput = header.querySelector(".app-header__search-input");

  // Updates the profile initials and displayed first name.
  function updateProfile(name) {
    nameElement.textContent = name;
    avatarElement.textContent = name.charAt(0).toUpperCase();
  }

  // Opens the required name setup on first visit.
  const currentName = getUserName();
  if (currentName) {
    updateProfile(currentName);
  } else {
    requestAnimationFrame(() => {
      if (dialog.isConnected) dialog.showModal();
    });
  }

  // Saves the first name and returns focus to the page.
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = saveUserName(nameInput.value);

    if (name) {
      updateProfile(name);
      dialog.close();
    }
  });

  // Keeps the first-visit setup required until a valid name is saved.
  dialog.addEventListener("cancel", (event) => event.preventDefault());

  // Focuses search when the user presses Ctrl+K or Command+K.
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
    }
  });

  return header;
}
