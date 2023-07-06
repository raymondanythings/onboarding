import useRouter from "../react-router-dom/hooks/useRouter";

const Home = () => {
  const { push } = useRouter();
  return (
    <div className="flex flex-col items-center space-y-3">
      <h1 className="text-white text-xl font-semibold">HOME</h1>
      <button
        className="text-white p-3 px-5 rounded-md bg-[#1A1A1A]"
        onClick={() => push("about")}
      >
        about
      </button>
    </div>
  );
};

export default Home;
