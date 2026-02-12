import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

type FeatureFlagContextType = {
  featureFlags: Record<string, boolean>;
};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(
  undefined,
);

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const user = useAuth();

  const fetchfeatureFlags = async () => {
    try {
      const response = await fetch(`/api/fetchFeatureFlags?uid=${user?.uid}`);

      if (!response.ok) throw new Error("Failed to fetch Feature Flags");

      const data = await response.json();

      setFeatureFlags(data.data);
    } catch (err) {
      console.error("Failed to fetch Feature Flags", err);
    }
  };

  useEffect(() => {
    if (user && user.uid) fetchfeatureFlags();
  }, [user]);

  return (
    <FeatureFlagContext.Provider value={{ featureFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error(
      "useFeatureFlags must be used inside a FeatureFlagProvider",
    );
  }

  return context;
};
