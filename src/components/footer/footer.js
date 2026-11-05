// Renders the compact developer credit footer.
import { config } from "../../config.js";
import "./footer.css";

export function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "app-footer";
  footer.innerHTML = `
    <p class="app-footer__credit"></p>
    <span class="app-footer__name"></span>
  `;

  footer.querySelector(".app-footer__credit").textContent =
    config.footer.credit;
  footer.querySelector(".app-footer__name").textContent = config.developer;

  return footer;
}
