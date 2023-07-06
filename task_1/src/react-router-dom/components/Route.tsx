const Route = ({
  component: Component,
}: {
  pathname: string;
  component: JSX.Element;
}) => {
  return Component;
};

export default Route;
