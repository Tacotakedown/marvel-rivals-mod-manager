import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useModManagerContext } from "../../util/ModManagerContext.tsx";
import { Sidebar } from "../Sidebar/Sidebar";
import { ContentProvider } from "../ContentProvider/ContentProvider.tsx";
import { SignIn } from "../SignIn/SignIn.tsx";

function handleButtonPress() {
  invoke("init_mod_manager").catch((err) => {
    console.error(err);
  });
}

function App() {
  const { config, page } = useModManagerContext();

  if (config.discord_id === "") {
    return (
      <div className="bg-grid-small-white/[0.1] gap-6 w-screen h-screen pt-16 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl">Welcome to the Mod Manager</h1>
        <SignIn />
      </div>
    );
  }
  return (
    <div className="bg-grid-small-white/[0.1] w-screen h-screen pt-16 flex flex-row text-white">
      <Sidebar />
      <ContentProvider />
    </div>
  );
}

export default App;
