import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpreadsheetStyle } from "./screens/SpreadsheetStyle/SpreadsheetStyle";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <SpreadsheetStyle />
  </StrictMode>,
);
