import React from "react";

type ModManagerContextType = {
  page: number;
  setPage: (to: number) => void;
};

const ModManagerContext = React.createContext<
  ModManagerContextType | undefined
>(undefined);

type ModManagerContextProviderProps = {
  children: React.ReactNode;
};

export const ModManagerContextProvider: React.FC<
  ModManagerContextProviderProps
> = (props: ModManagerContextProviderProps) => {
  const [page, setPage] = React.useState<number>(0);

  return (
    <ModManagerContext.Provider value={{ page, setPage }}>
      {props.children}
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
