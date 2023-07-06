import { Children, PropsWithChildren } from "react";

import { hasObjectKeys } from "../utils";
import RouterProvider, { LocationMap } from "../context/RouterProvider";

const Router = ({ children }: PropsWithChildren) => {
  const currentPathRoute: LocationMap = {};
  Children.forEach(children, (element) => {
    if (element && typeof element === "object" && "props" in element) {
      currentPathRoute[element.props.path] = element;
    }
  });

  if (hasObjectKeys(currentPathRoute)) {
    console.error("not found route path");
    return <>not found route path</>;
  }
  return <RouterProvider locationMap={currentPathRoute} />;
};

export default Router;
