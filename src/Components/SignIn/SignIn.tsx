"use client";
import { useState } from "react";
import { useModManagerContext } from "../../util/ModManagerContext";

export const SignIn: React.FC = () => {
  const { setDiscordId } = useModManagerContext();
  const [key, setKey] = useState("");

  const handleSubmit = () => {
    const parsedKey = key.trim();
    console.log("Submitting key:", parsedKey);
    if (parsedKey === "") {
      return;
    }
    setDiscordId(parsedKey);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-[#2dd4bf] bg-[#2dd4bf20] text-white rounded-lg shadow-lg">
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter your Discord ID"
        className="p-2 border border-sky-600 rounded w-64 text-white bg-transparent"
      />
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-sky-500/5 border border-sky-500/60 px-4 py-2 rounded hover:bg-sky-500/50 transition-all duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
