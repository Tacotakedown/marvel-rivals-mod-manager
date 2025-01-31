"use client";
import { Window } from "@tauri-apps/api/window";
import React from "react";

type TitlebarProps = {
  title: string;
  icon: React.ReactNode;
};

export const Titlebar: React.FC<TitlebarProps> = (
  props: TitlebarProps
): React.ReactNode => {
  const [appWindow, setAppWindow] = React.useState<Window | null>(null);

  React.useEffect(() => {
    const window = Window.getCurrent();
    setAppWindow(window);
  }, []);

  const handleMinimize = async () => {
    if (appWindow) await appWindow.minimize();
  };

  const handleMaximize = async () => {
    if (appWindow) {
      if (await appWindow.isMaximized()) {
        await appWindow.unmaximize();
      } else {
        await appWindow.maximize();
      }
    }
  };

  const handleClose = async () => {
    if (appWindow) await appWindow.close();
  };

  return (
    <div
      data-tauri-drag-region
      className="w-screen justify-between h-16 border-b-2 border-b-[#2c3133] select-none flex fixed top-0 left-0 right-0 text-red"
    >
      <div className="flex items-center gap-5 pointer-events-none">
        <div className="pl-2 w-8">{props.icon}</div>
        <div className="pl-5 text-white text-center font-bold pointer-events-none">
          {" "}
          {props.title}
        </div>
      </div>

      <div className="flex items-center justify-center h-16">
        <div
          className="inline-fex justify-center items-center w-10 h-10"
          onClick={handleMinimize}
        >
          <img
            className="invert"
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          />
        </div>

        <div
          className="inline-fex justify-center items-center w-10 h-10"
          onClick={handleMaximize}
        >
          <img
            className="invert"
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          />
        </div>
        <div
          className="inline-fex justify-center items-center w-10 h-10"
          onClick={handleClose}
        >
          <img
            src="https://api.iconify.design/mdi:close.svg"
            className="invert"
            alt="close"
          />
        </div>
      </div>
    </div>
  );
};
