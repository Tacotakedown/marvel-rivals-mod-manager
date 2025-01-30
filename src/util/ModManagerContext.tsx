import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useState } from "react";

type ModManagerConfig = {
  game_path: string;
  mods_enabled: string[];
  discord_id: string;
};

type ModManagerContextType = {
  page: number;
  setPage: (to: number) => void;
  config: ModManagerConfig;
  setGamePath: (path: string) => Promise<void>;
  toggleMod: (modId: string, enabled: boolean) => Promise<void>;
  setDiscordId: (discordId: string) => Promise<void>;
};

const ModManagerContext = React.createContext<
  ModManagerContextType | undefined
>(undefined);

type ModManagerContextProviderProps = {
  children: React.ReactNode;
};

export const ModManagerContextProvider: React.FC<
  ModManagerContextProviderProps
> = ({ children }: ModManagerContextProviderProps) => {
  const [page, setPage] = useState<number>(0);
  const [config, setConfig] = useState<ModManagerConfig>({
    game_path: "",
    mods_enabled: [],
    discord_id: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const fetchedConfig = await invoke<ModManagerConfig>("get_config");
        setConfig(fetchedConfig);
      } catch (error) {
        console.error("Failed to fetch config:", error);
      }
    };

    fetchConfig();

    const unlisten = listen<ModManagerConfig>("config_updated", (event) => {
      setConfig(event.payload);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const setGamePath = async (path: string) => {
    try {
      await invoke("update_game_path", { path });
    } catch (error) {
      console.error("Failed to update game path:", error);
    }
  };

  const toggleMod = async (modId: string, enabled: boolean) => {
    try {
      await invoke("toggle_mod", { modId, enabled });
    } catch (error) {
      console.error("Failed to toggle mod:", error);
    }
  };

  const setDiscordId = async (discordId: string) => {
    try {
      await invoke("set_discord_id", { discordId });
    } catch (error) {
      console.error("Failed to set discord id:", error);
    }
  };

  return (
    <ModManagerContext.Provider
      value={{
        page,
        setPage,
        config,
        setGamePath,
        toggleMod,
        setDiscordId,
      }}
    >
      {children}
    </ModManagerContext.Provider>
  );
};

export const useModManagerContext = (): ModManagerContextType => {
  const context = React.useContext(ModManagerContext);
  if (!context) {
    throw new Error("useModManagerContext called outside the provider tree");
  }
  return context;
};
