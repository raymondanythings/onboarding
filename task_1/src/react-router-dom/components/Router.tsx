import { Children, PropsWithChildren } from "react";
import RouterProvider, { LocationMap } from "../context/RouterProvider";

const Router = ({ children }: PropsWithChildren) => {
  const currentPathRoute: LocationMap = {};
  Children.forEach(children, (element) => {
    if (
      element &&
      typeof element === "object" &&
      "props" in element &&
      element.props.path !== undefined
    ) {
      currentPathRoute[element.props.path] = element;
    }
  });

  return <RouterProvider locationMap={currentPathRoute} />;
};

export default Router;
