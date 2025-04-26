import { Avatar, Card, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import PostCard from "../Post/PostCard";
import CreatePostModal from "../CreatePost/CreatePostModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostAction } from "../../Redux/Post/post.action";

const posts = [1, 1, 1, 1, 1];
const MiddlePart = () => {
  const dispatch=useDispatch();
  const {post} = useSelector(store=>store);

  console.log("post store ", post)

  const [openCreatePostModal,setOpenCreatePostModal]=useState(false);

  const handleCloseCreatePostModal=()=>setOpenCreatePostModal(false);

  const handleOpenCreatePostModel = () => {
    setOpenCreatePostModal(true);
    console.log("open post model....",openCreatePostModal);
  };

  useEffect(()=>{
    dispatch(getAllPostAction())
  },[post.newComment])

  return (
    <div className="px-20">
      <Card className="p-5 mt-5">
        <div className="flex justify-between">
          <Avatar />

          <input
            onClick={handleOpenCreatePostModel}
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
        {post.posts.map((item) => (
          <PostCard item={item} />
        ))}
      </div>
      <div>
        <CreatePostModal handleClose={handleCloseCreatePostModal} open={openCreatePostModal}/>
      </div>
    </div>
  );
};

export default MiddlePart;
