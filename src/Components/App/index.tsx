import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useModManagerContext } from "../../util/ModManagerContext.tsx";
import { Sidebar } from "../Sidebar/Sidebar";

function handleButtonPress() {
	invoke("init_mod_manager").catch((err) => {
		console.error(err);
	});
}

function App() {
	const { config } = useModManagerContext();
	return (
		<div className="bg-grid-small-white/[0.1] w-screen h-screen pt-16 text-white">
			<Sidebar />
			Config: {config.game_path}
			<br />
			<button
				onClick={() => {
					handleButtonPress();
				}}
			>
				Invoke
			</button>
		</div>
	);
}

export default App;
