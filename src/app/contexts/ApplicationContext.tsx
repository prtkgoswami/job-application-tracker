"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type ApplicationContextType = {
  triggerRefetch: () => void;
  refetchKey: number;
};

const ApplicationsContext = createContext<ApplicationContextType | undefined>(
  undefined
);

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [refetchKey, setRefetchKey] = useState(0);

  const triggerRefetch = useCallback(() => {
    setRefetchKey((prev) => prev + 1);
  }, []);

  return (
    <ApplicationsContext.Provider value={{ triggerRefetch, refetchKey }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplicationsRefetch = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error(
      "useApplicaitonsRefetch must be used inside an ApplicationsProvider"
    );
  }
  return context;
};
