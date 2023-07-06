import { useContext } from "react";
import { routeContext } from "../context/RouteContext";

const useRouter = () => {
  const { pop, replace, push } = useContext(routeContext);

  return { push, pop, replace };
};

export default useRouter;
