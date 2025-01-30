import type React from "react";
import { useModManagerContext } from "../../util/ModManagerContext";
import { DiscordAvatar } from "../UserAvatar/UserAvatar";

type PageType = {
  name: string;
  icon: string;
};

export const Sidebar: React.FC = () => {
  const { page, setPage, config } = useModManagerContext();

  const pages: PageType[] = [
    { name: "Mods", icon: "Icon" },
    { name: "Browse", icon: "Icon" },
    { name: "Settings", icon: "Icon" },
  ];

  const handlePageChange = (page: number): void => {
    setPage(page);
  };

  return (
    <div className="flex pt-5 flex-col md:w-60 w-1/3 justify-between items-center">
      <div className="flex gap-4 flex-col md:w-60 w-full justify-start items-center">
        {pages.map((p, index) => (
          <button
            onClick={() => {
              handlePageChange(index);
            }}
            key={index}
            className={`px-8 ${
              page === index ? "bg-slate-700/30" : "bg-slate-700/10"
            }
			 w-2/3 md:w-40 py-2  rounded-xl relative text-white text-sm hover:shadow-lg hover:shadow-white/[0.1] transition duration-500 border ${
         page === index ? "border-slate-600" : "border-slate-600"
       }`}
          >
            <div
              className={`gradient-line ${
                page === index ? "active" : "inactive"
              }`}
            />
            <span className="relative z-20">{p.name}</span>
          </button>
        ))}
      </div>
      <div>
        <DiscordAvatar userId={config.discord_id} size={4096} />
      </div>
    </div>
  );
};
