// Reads and writes the user's saved first name.
import { config } from "../config.js";

export function getUserName() {
  try {
    return localStorage.getItem(config.userNameKey)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function saveUserName(name) {
  const cleanName = name.trim();

  if (!cleanName) return "";

  try {
    localStorage.setItem(config.userNameKey, cleanName);
  } catch {
    // Keeps the name available for the current page session if storage is blocked.
  }

  return cleanName;
}
