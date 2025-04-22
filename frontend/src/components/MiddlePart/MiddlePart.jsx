import { Avatar, Card, IconButton } from "@mui/material";
import React from "react";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from '@mui/icons-material/Videocam';
import ArticleIcon from '@mui/icons-material/Article';
import PostCard from "../Post/PostCard";

const posts=[1,1,1,1,1]
const MiddlePart = () => {
  const handleOpenCreatePostModel = () => {
    console.log("open post model....");
  };
  return (
    <div className="px-20">
      <Card className="p-5 mt-5">
        <div className="flex justify-between">
          <Avatar />

          <input
            readOnly
            className="outline-none w-[90%] rounded-full px-5 bg-transparent border-[#3b4054] border"
            type="text"
          />
        </div>
        <div className="flex justify-center space-x-9 mt-5">
          <div className="flex items-center">
            <IconButton color="primary" onClick={handleOpenCreatePostModel}>
              <ImageIcon />
            </IconButton>

            <span>media</span>
          </div>

          <div className="flex items-center">
            <IconButton color="primary" onClick={handleOpenCreatePostModel}>
              <VideocamIcon />
            </IconButton>

            <span>video</span>
          </div>

          <div className="flex items-center">
            <IconButton color="primary" onClick={handleOpenCreatePostModel}>
              <ArticleIcon />
            </IconButton>

            <span>Write Article</span>
          </div>

          
        </div>
      </Card>
      <div className="mt-5 space-y-5">
        {posts.map((item)=><PostCard/>)}

        

      </div>
    </div>
  );
};

export default MiddlePart;
