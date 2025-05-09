import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaImage, FaVideo } from "react-icons/fa";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div
      className="relative text-black bg-white rounded-md px-4 bg-cover bg-center shadow-md"
      style={{
        width: "660px",
        left: "440px",
        top: "85px",
        height: "50px",
        borderRadius: "50px",
      }}
    >
      <img
        src={
          user?.profileImage ||
          "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
        }
        alt="User Avatar"
        className="w-[40px] h-[40px] rounded-full object-cover border-4 border-gray-200 shadow-md"
        style={{ position: "absolute", left: "10px", top: "5px" }}
      />
      <Link
        to="/create-post"
        className="absolute left-[50px] top-[0px] h-[50px] w-[550px] bg-white text-black px-6 rounded-[50px] font-bold
             hover:bg-gray-100 hover:text-white transition 
             flex items-center justify-start gap-4"
      >
        <span>Create a Recipe</span>
        <FaImage className="text-green-500 text-xl absolute left-[430px]" />
        <h1
          className="text-green-500 absolute text-lg left-[455px]"
          style={{ fontFamily: "roboto" ,fontWeight: "700"}}
        >
          Image
        </h1>

        <FaVideo className="text-red-500 text-xl absolute left-[520px]" />
        <h1
          className="text-red-500 text-lg absolute left-[545px]"
          style={{ fontFamily: "roboto", fontWeight: "700" }}
        >
          Video
        </h1>
      </Link>
    </div>
  );
};

export default Topbar;
