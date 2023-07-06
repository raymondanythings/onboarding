import useRouter from "../react-router-dom/hooks/useRouter";

const About = () => {
  const { replace, push, pop } = useRouter();
  return (
    <div className="flex flex-col items-center space-y-3">
      <h1 className="text-white text-xl font-semibold">ABOUT</h1>
      <button
        className="text-white p-3 px-5 rounded-md bg-[#1A1A1A]"
        onClick={() => pop()}
      >
        GO HOME
      </button>
      <button
        className="text-white p-3 px-5 rounded-md bg-[#1A1A1A]"
        onClick={() => replace("/")}
      >
        GO replace
      </button>
      <button
        className="text-white p-3 px-5 rounded-md bg-[#1A1A1A]"
        onClick={() => push("/")}
      >
        GO push
      </button>
    </div>
  );
};

export default About;
