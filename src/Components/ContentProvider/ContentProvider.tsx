import React from "react";
import { useModManagerContext } from "../../util/ModManagerContext";
import { Mods } from "../../Pages/Mods/Mods";
import { ModDatabase } from "../../Pages/ModDatabase/ModDatabase";
import { type SettingOption, Settings } from "../../Pages/Settings/Settings";

export const ContentProvider = () => {
  const { page } = useModManagerContext();

  const settingsConfig: SettingOption[] = [
    { key: "darkMode", label: "Dark Mode", type: "checkbox" },
    {
      key: "language",
      label: "Language",
      type: "select",
      options: ["English", "Spanish", "French"],
    },
    {
      key: "username",
      label: "buttonCallback",
      type: "button",
      buttonCallback: () => {
        console.log("Button Clicked");
      },
      buttonLabel: "Click Me",
    },
  ];

  const handleSettingsChange = (key: string, value: any) => {
    console.log(`Setting changed: ${key} = ${value}`);
  };

  switch (page) {
    case 0:
      return <Mods />;
    case 1:
      return <ModDatabase />;
    case 2:
      return (
        <Settings settings={settingsConfig} onChange={handleSettingsChange} />
      );
  }
};
