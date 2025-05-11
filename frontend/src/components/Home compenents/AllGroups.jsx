import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllGroups = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (!user) {
    return (
      <div className="user-info-card fixed top-[85px] left-[50%] transform -translate-x-1/2 font-bold w-[300px] h-[100px] space-y-4 z-50 pr-2 rounded-2xl scrollbar-thin scrollbar-thumb-gray-200 bg-white p-4 text-center shadow-sm">
        <h3 className="text-xl font-semibold">User Information</h3>
        <p>No user data available.</p>
      </div>
    );
  }

  return (
    <div className="user-info-card fixed top-[85px] left-[1227px] transform -translate-x-1/2 w-[300px] z-50 pr-2 scrollbar-thin scrollbar bg-white p-4 text-left shadow-sm">
      <h4 className="text-lg font-semibold mb-4">&nbsp;All Groups ({groups?.length})</h4>
  
      <button className="bg-blue-500 text-white px-4 py-2 mb-4 hover:bg-blue-600 transition duration-300 absolute top-[15px] right-8 rounded-3xl">
        <Link to="/groups">Create Group</Link>
      </button>
  
      {loading ? (
        <p className="text-center text-gray-600">Loading groups...</p>
      ) : groups.length === 0 ? (
        <p className="text-center text-gray-600">No groups found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {groups.slice(0, 3).map((group, index) => {
              const colors = [
                "orange-200"
              ];
              const borderColor = colors[index % colors.length];
  
              return (
                <div
                  key={group._id?.$oid || group._id}
                  className="group-card flex items-center bg-white rounded-lg p-3 shadow-md hover:shadow-sm transition duration-300 w-[260px] border-t-4 h-[65px]"
                  style={{ borderTopColor: borderColor, marginTop: "12px" }}
                >
                  <div
                    className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mr-4"
                    style={{
                      backgroundImage: group.icon
                        ? `url(${group.icon})`
                        : "url('https://via.placeholder.com/80')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!group.icon && (
                      <span className="text-gray-600 text-2xl">
                        {group.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-medium text-gray-800">{group.name}</h5>
                    <div className="text-sm text-gray-600">
                      <span className="font-bold">{group.members?.length || 0}</span>{" "}
                      Members
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link to={`/groups/${group.id}`}>
                      <button className="text-gray-500 hover:text-gray-700">
                        <i className="fas fa-eye"></i>
                      </button>
                    </Link>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to={`/groups/${group.id}`}>
                      <button className="text-gray-500 hover:text-gray-700">
                        <i className="fas fa-comment"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
  
          {/* See All Groups Button */}
          <div className="mt-4 text-center">
            <Link to="/groups">
              <button className="text-blue-600 hover:underline text-sm font-semibold">
                See All Groups
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
  
};

export default AllGroups;
