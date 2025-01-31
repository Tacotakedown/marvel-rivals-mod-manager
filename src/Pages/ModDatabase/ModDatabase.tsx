import { useState, useEffect } from "react";

type ModDbList = {
  id: string;
  title: string;
  version: string;
  thumbnail: string;
  file_path: string;
};

export const ModDatabase = () => {
  const [mods, setMods] = useState<ModDbList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectionIssue, setShowConnectionIssue] = useState(false);

  useEffect(() => {
    const fetchMods = async () => {
      try {
        const response = await fetch("http://localhost:8080/metadata");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ModDbList[] = await response.json();
        setMods(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching mods:", err);
      }
    };

    fetchMods();

    const timer = setTimeout(() => {
      if (loading) {
        setShowConnectionIssue(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="w-7/8 h-85v overflow-y-auto">
        <h1 className="text-xl font-bold">ModDatabase</h1>
        <div className="flex flex-col items-center justify-center h-70v gap-4 mt-8">
          <div className="w-12 h-12 border-4 border-[#2dd4bf10] border-t-[#2dd4bf] rounded-full animate-spin" />
          {showConnectionIssue && (
            <p className="text-yellow-500 mt-4 text-center w-1/2">
              Please check your connection. If you have internet, Taco's PC is
              probably off.
            </p>
          )}
        </div>
      </div>
    );
  }

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
