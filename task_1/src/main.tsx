import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Router } from "react-router-dom";
import Home from "./screen/Home";
import About from "./screen/About";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Route path="" component={<Home />} />
      <Route path="about" component={<About />} />
    </Router>
  </React.StrictMode>
);
