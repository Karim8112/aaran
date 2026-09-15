import { Link } from "react-router-dom";

const NotFound = function ({ extraText }: { extraText?: string }) {
  return (
    <>
      {" "}
      <div className="min-h-screen  bg-[#0d0d0d] text-white flex flex-col  gap-6! items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-red-400 mb-2">Page Not Found</h2>
        <p>{extraText}</p>
        <p className="text-zinc-400 mb-6 max-w-md">
          We couldn't find this page
        </p>
        <Link
          to="/home"
          className="px-6! py-3!  text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors duration-300"
        >
          Return to Home Page
        </Link>
      </div>
    </>
  );
};

export default NotFound;
