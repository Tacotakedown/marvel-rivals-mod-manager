import { useState } from "react";

export type SettingOption = {
  key: string;
  label: string;
  type: "checkbox" | "select" | "button";
  options?: string[];
  buttonCallback?: () => void;
  buttonLabel?: string;
};

type SettingsProps = {
  settings: SettingOption[];
  onChange: (key: string, value: any) => void;
};

export const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {
  const [values, setValues] = useState<{ [key: string]: any }>(() => {
    const initialState: { [key: string]: any } = {};
    props.settings.forEach((setting) => {
      initialState[setting.key] = setting.type === "checkbox" ? false : "";
    });

    return initialState;
  });

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    props.onChange(key, value);
  };

  return (
    <div className="p-4 w-5/8 mx-auto bg-transparent shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        {props.settings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <label className="font-medium">{setting.label}</label>
            {setting.type === "checkbox" && (
              <input
                type="checkbox"
                checked={values[setting.key]}
                onChange={(e) => handleChange(setting.key, e.target.checked)}
                className="w-5 h-5"
              />
            )}
            {setting.type === "select" && setting.options && (
              <select
                value={values[setting.key]}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                className="border p-1 rounded"
              >
                {setting.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {setting.type === "button" && (
              <button
                onClick={setting.buttonCallback}
                className="bg-blue-500/5 border border-blue-500/80 px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200"
              >
                {setting.buttonLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
