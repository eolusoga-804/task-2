// Reads and writes the user's saved first name.
import { config } from "../config.js";

// Formats each name word in title case, including hyphenated names.
function toTitleCase(name) {
  return name
    .trim()
    .toLocaleLowerCase(config.locale)
    .replace(/(^|[\s'-])(\p{L})/gu, (_, prefix, letter) => {
      return `${prefix}${letter.toLocaleUpperCase(config.locale)}`;
    });
}

export function getUserName() {
  try {
    // Formats existing saved names before showing them in the interface.
    return toTitleCase(localStorage.getItem(config.userNameKey) ?? "");
  } catch {
    return "";
  }
}

export function saveUserName(name) {
  // Saves the user's name in the same format used throughout the interface.
  const cleanName = toTitleCase(name);

  if (!cleanName) return "";

  try {
    localStorage.setItem(config.userNameKey, cleanName);
  } catch {
    // Keeps the name available for the current page session if storage is blocked.
  }

  return cleanName;
}
