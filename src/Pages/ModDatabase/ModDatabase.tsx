import { useState, useEffect } from "react";

type ModList = {
  id: string;
  title: string;
  version: string;
  thumbnail: string;
  file_path: string;
};

export const ModDatabase = () => {
  const [mods, setMods] = useState<ModList[]>([]);

  useEffect(() => {
    const fetchMods = async () => {
      try {
        const response = await fetch("http://localhost:8080/metadata");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ModList[] = await response.json();
        setMods(data);
      } catch (err) {
        console.error("Error fetching mods:", err);
      }
    };

    fetchMods();
  }, []);

  return (
    <div className="w-7/8 h-85v overflow-y-auto">
      <h1 className="text-xl font-bold">ModDatabase</h1>
      <div className="flex flex-col gap-4">
        {mods.map((mod) => (
          <div
            className="w-11/12 p-3 border border-[#2dd4bf50] rounded-xl flex flex-row justify-between"
            key={mod.id}
          >
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-bold text-xl">{mod.title}</h2>
              <p>Version: {mod.version}</p>
            </div>
            <div className="w-14 flex items-center justify-center">
              <img src={mod.thumbnail} alt={mod.title} />
            </div>

            <div className=" p-2 h-12 border flex items-center justify-center border-[#2dd4bf] w-24 text-center rounded-lg shadow-md shadow-[#2dd4bf]/">
              Download
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
