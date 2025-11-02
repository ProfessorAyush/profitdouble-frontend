// Apicontext.tsx
import { createContext, useContext } from "react";

interface ApiContextType {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const apiContext = createContext<ApiContextType | undefined>(undefined);

// Export custom hook
export function useApi() {
  const context = useContext(apiContext);
  if (!context) {
    throw new Error("useApi must be used within ApiState provider");
  }
  return context;
}

export default apiContext;