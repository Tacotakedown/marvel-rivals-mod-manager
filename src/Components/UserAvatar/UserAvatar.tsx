import { invoke } from "@tauri-apps/api/core";
import React, { useState, useEffect } from "react";
import { useOutsideClick } from "../../Hooks/useOutsideClick";
import { useModManagerContext } from "../../util/ModManagerContext";

interface DiscordAvatarProps {
  userId: string;
  size?: number;
}

export const DiscordAvatar: React.FC<DiscordAvatarProps> = (
  props: DiscordAvatarProps
) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const popupRef = React.useRef<HTMLDivElement>(null);

  const { setDiscordId } = useModManagerContext();

  useOutsideClick(popupRef, () => {
    setShowPopup(false);
  });

  const handleLogout = () => {
    setDiscordId("").catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await invoke("fetch_discord_user", {
          userId: props.userId,
        });
        const data = JSON.parse(response as string);
        const avatarHash = data.avatar;
        const avatarUrl = avatarHash
          ? `https://cdn.discordapp.com/avatars/${props.userId}/${avatarHash}.png?size=${props.size}`
          : `https://cdn.discordapp.com/embed/avatars/${
              Number(props.userId) % 5
            }.png`;

        console.log(avatarUrl);

        setName(data.username);

        setAvatarUrl(avatarUrl);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [props.userId, props.size]);

  if (loading) {
    return (
      <div className="p-4  flex items-center justify-center flex-col">
        <div className="w-12 h-12 rounded-full animate-pulse bg-gray-200" />
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 text-sm">Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      ref={popupRef}
      className="p-4 flex items-center justify-center flex-col"
    >
      <img
        onClick={() => setShowPopup(!showPopup)}
        src={avatarUrl || ""}
        alt={`Discord user ${props.userId} avatar`}
        className="rounded-full hover:shadow-white/40 transition-all duration-200 w-12 shadow-lg shadow-white/[0.1]"
        width={props.size}
        height={props.size}
      />
      <div>Welcome {name}</div>
      {showPopup && (
        <div
          className="absolute bg-red-500/5 hover:bg-red-500/20 shadow-md rounded-lg p-2 bottom-24 left-20 w-20 text-center shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 border-red-500 border"
          onClick={() => {
            handleLogout();
            setShowPopup(false);
          }}
        >
          Logout
        </div>
      )}
    </div>
  );
};
