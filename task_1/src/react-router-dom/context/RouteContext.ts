import { Dispatch, SetStateAction, createContext } from "react";
const noop = () => {
  return;
};
export interface RouterContext {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  pop: () => void;
  replace: (to: string, state?: unknown) => void;
  push: (to: string, state?: unknown) => void;
  pathname: string;
}
const initialContext: RouterContext = {
  history: [],
  pathname: "",
  setHistory: noop,
  pop: noop,
  push: noop,
  replace: noop,
};

export const routeContext = createContext<RouterContext>(initialContext);
export const locationContext = createContext({});
