import React from "react";
import { useModManagerContext } from "../../util/ModManagerContext";

type PageType = {
  name: string;
  icon: string;
  to: number;
};

export const Sidebar: React.FC = () => {
  const { page, setPage } = useModManagerContext();

  const pages: PageType[] = [
    { name: "Home", icon: "Icon", to: 0 },
    { name: "Settings", icon: "Icon", to: 1 },
  ];

  const handlePageChange = (page: number): void => {
    setPage(page);
  };

  return (
    <div>
      {page}
      {pages.map((p, indx) => (
        <div
          onClick={() => {
            handlePageChange(p.to);
          }}
          key={indx}
        >
          {p.name}
        </div>
      ))}
    </div>
  );
};
