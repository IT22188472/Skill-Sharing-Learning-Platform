import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Followers = () => {
  const { user } = useAuth();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  useEffect(() => {
    axios
      .get("http://localhost:8080/users/all")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleFollow = async (userId2) => {
    try {
      await axios.put(
        `http://localhost:8080/api/users/follow/${userId2}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      alert("Followed successfully!");
    } catch (err) {
      alert("Failed to follow user.");
      console.error("Follow error:", err.response || err.message);
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">Error: {error}</div>;

  return (
    <div className="fixed top-[425px] left-[1077px] w-[307px] overflow-y-auto space-y-4 z-50 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
      <div className="bg-white shadow-xl p-6 border border-gray-100 ">
        <h1 className="text-xl font-semibold text-gray-00 mb-4 text-left">
          &nbsp;&nbsp;Following&nbsp;({user?.following?.length || 0})
        </h1>
        <div className="space-y-4 max-h-[185px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
          {users.length > 0 ? (
            users
              .filter((u) => u.id !== currentUser?.id)
              .map((u, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition h-[50px]"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={u.profileImage || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"}
                      alt={`${u.firstName}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">
                      {u.firstName}
                    </span>
                  </div>
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700"
                    onClick={() => handleFollow(u.id)}
                  >
                    Follow
                  </button>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
        <div className="mt-4 text-center">
          <Link to="/">
            <button className="text-blue-600 hover:underline text-sm font-semibold">
              See All
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Followers;
