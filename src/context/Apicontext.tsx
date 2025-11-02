import { createContext } from "react";

const apiContext = createContext<Record<string, unknown> | null>(null);

export default apiContext;

