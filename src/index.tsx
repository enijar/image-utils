import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app.tsx";

const root = document.querySelector("#root");

if (root === null) {
  throw new Error("No #root element");
}

ReactDOM.createRoot(root).render(<App />);
