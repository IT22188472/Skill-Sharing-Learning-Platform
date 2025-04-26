import { Avatar, Box, Button, Card, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../../components/Post/PostCard";
import { useSelector } from "react-redux";
import ProfileModal from "./ProfileModal";

const tabs = [
  { value: "post", name: "Post" },
  { value: "saved", name: "Saved" },
  { value: "repost", name: "Repost" },
];

// Dummy posts and saved posts
const posts = [
  { id: 1, liked: false, title: "First Post" },
  { id: 2, liked: true, title: "Second Post" },
  { id: 3, liked: false, title: "Third Post" },
  { id: 4, liked: true, title: "Fourth Post" },
];

const savedPost = [
  { id: 1, liked: true, title: "Saved Post 1" },
  { id: 2, liked: true, title: "Saved Post 2" },
  { id: 3, liked: true, title: "Saved Post 3" },
];

const Profile = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpenProfileModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = useState("post");
  const { auth } = useSelector((store) => store);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card className="my-10 w-[70%]">
      <div className="rounded-md">
        {/* Cover Image */}
        <div className="h-[15rem]">
          <img
            className="w-full h-full rounded-t-md"
            src="https://cdn.pixabay.com/photo/2025/04/15/17/14/lighthouse-9535881_1280.jpg"
            alt="cover"
          />
        </div>

        {/* Avatar and Button */}
        <div className="px-5 flex justify-between items-start mt-5 h-[5rem]">
          <Avatar
            className="transform -translate-y-24"
            sx={{ width: "10rem", height: "10rem" }}
            src="https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"
          />

          {true ? (
            <Button
              sx={{ borderRadius: "20px" }}
              variant="outlined"
              onClick={handleOpenProfileModal}
            >
              Edit Profile
            </Button>
          ) : (
            <Button sx={{ borderRadius: "20px" }} variant="outlined">
              Follow
            </Button>
          )}
        </div>

        {/* User Info */}
        <div className="p-5">
          <div>
            <h1 className="py-1 font-bold text-xl">
              {auth.user?.firstName + " " + auth.user?.lastName}
            </h1>
            <p>
              @{auth.user?.firstName?.toLowerCase()}_{auth.user?.lastName?.toLowerCase()}
            </p>
          </div>

          <div className="flex gap-5 items-center py-3">
            <span>3 posts</span>
            <span>8 followers</span>
            <span>5 following</span>
          </div>

          <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>

        {/* Tabs */}
        <section>
          <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="wrapped label tabs example"
            >
              {tabs.map((item) => (
                <Tab key={item.value} value={item.value} label={item.name} wrapped />
              ))}
            </Tabs>
          </Box>

          {/* Posts Content */}
          <div className="flex justify-center">
            {value === "post" ? (
              <div className="space-y-5 w-[70%] my-10">
                {posts.map((item) => (
                  <div key={item.id} className="border border-slate-100 rounded-md">
                    <PostCard post={item} />
                  </div>
                ))}
              </div>
            ) : value === "saved" ? (
              <div className="space-y-5 w-[70%] my-10">
                {savedPost.map((item) => (
                  <div key={item.id} className="border border-slate-100 rounded-md">
                    <PostCard post={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="my-10 text-center text-gray-500">No reposts yet.</div>
            )}
          </div>
        </section>
      </div>

      {/* Profile Modal */}
      <section>
        <ProfileModal open={open} handleClose={handleClose} />
      </section>
    </Card>
  );
};

export default Profile;
