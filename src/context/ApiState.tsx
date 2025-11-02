import { useState, ReactNode } from "react";
import apiContext from "./Apicontext";

export function ApiState({ children }: { children: ReactNode }) {
  const [apiBaseUrl, setApiBaseUrl] = useState("https://doubleprofit-backend.onrender.com");

  return (
    <apiContext.Provider value={{ apiBaseUrl, setApiBaseUrl }}>
      {children}
    </apiContext.Provider>
  );
}