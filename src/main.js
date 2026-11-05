// Mounts the shared app header and its first-visit setup.
import { renderHeader } from "./components/header/header.js";
import "./styles/global.css";

const app = document.querySelector("#app");
app.replaceChildren(renderHeader());
