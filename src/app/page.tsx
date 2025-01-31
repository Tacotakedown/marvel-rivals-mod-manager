"use client";
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import { App } from "../Components/App/App";
import { Titlebar } from "../Components/Titlebar/Titlebar";
import { Icon } from "../assets/Icons/Logo";
import { ModManagerContextProvider } from "../util/ModManagerContext";

export default function Page() {
  return (
    <ModManagerContextProvider>
      <Titlebar title="Marvel Rivals Mod Manager" icon={Icon} />
      <App />
    </ModManagerContextProvider>
  );
}
