import {
  PropsWithChildren,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { routeContext } from "../context/RouteContext";
export type LocationMap = { [key in string]: ReactNode };
const RouterProvider = ({
  locationMap,
}: PropsWithChildren<{
  locationMap: LocationMap;
}>) => {
  const [history, setHistory] = useState<string[]>([window.location.pathname]);
  const pathname = window.location.pathname;
  const initialPath = useRef([window.location.pathname]).current;
  const renderItem = locationMap[pathname.replace("/", "")];
  const handleListener = useCallback(
    (event: PopStateEvent) => {
      event.preventDefault();
      setHistory(event.state?.history ?? initialPath);
    },
    [initialPath]
  );
  const push = useCallback(
    <T,>(location: string, state?: T) => {
      const newState = {
        ...(state || {}),
        history: [...(history || []), location],
      };
      window.history.pushState(newState, "", location);
      window.dispatchEvent(new PopStateEvent("popstate", { state: newState }));
    },
    [history]
  );
  const replace = useCallback(
    <T,>(location: string, state?: T) => {
      const newHistory = [...history];
      newHistory[newHistory.length - 1] = location;
      const newState = { ...(state || {}), history: newHistory };
      window.history.replaceState(newState, "", location);
      window.dispatchEvent(new PopStateEvent("popstate", { state: newState }));
    },
    [history]
  );
  const pop = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handleListener);
    return () => {
      window.removeEventListener("popstate", handleListener);
    };
  }, [handleListener]);

  if (!isValidElement(renderItem)) {
    return <>Has No Route path.</>;
  }

  return (
    <routeContext.Provider
      value={{ history, setHistory, pathname, pop, push, replace }}
    >
      {cloneElement(renderItem, { pathname } as {
        pathname: string;
      })}
    </routeContext.Provider>
  );
};

export default RouterProvider;
