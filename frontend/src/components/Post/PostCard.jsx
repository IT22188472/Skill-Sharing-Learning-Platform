import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
  CircularProgress
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction, likePostAction } from "../../Redux/Post/post.action";

const PostCard = ({ item }) => {
  // First, call all hooks unconditionally
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  // Then handle the case where item is undefined
  if (!item) return null;

  // Safe access to liked array
  const likedArray = Array.isArray(item.liked) ? item.liked : [];
  const isLiked = likedArray.some(user => user?.id === auth.user?.id);

  const handleShowComment = () => setShowComments(!showComments);

  const handleCreateComment = (content) => {
    const reqData = {
      postId: item.id,
      data: {
        content,
      },
    };
    dispatch(createCommentAction(reqData));
  };

  const handleLikePost = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await dispatch(likePostAction(item.id));
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {item.user?.firstName?.[0] || 'U'}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${item.user?.firstName || ''} ${item.user?.lastName || ''}`}
        subheader={
          item.user?.firstName && item.user?.lastName 
            ? `@${item.user.firstName.toLowerCase()}_${item.user.lastName.toLowerCase()}`
            : ''
        }
      />

      {item.imageUrl && (
        <img
          className="w-full max-h-[50rem] object-cover object-top"
          src={item.imageUrl}
          alt="Post content"
        />
      )}

      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.title && `Title: ${item.title}`}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.ingredients && `Ingredients: ${item.ingredients}`}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.instructions && `Instruction: ${item.instructions}`}
        </Typography>
      </CardContent>

      <CardActions className="flex justify-between" disableSpacing>
        <div>
          <IconButton onClick={handleLikePost} disabled={isLiking}>
            {isLiking ? (
              <CircularProgress size={24} />
            ) : isLiked ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>

          <IconButton><ShareIcon /></IconButton>
          <IconButton onClick={handleShowComment}><ChatBubbleIcon /></IconButton>
        </div>
        <div>
          <IconButton>
            <BookmarkIcon />
          </IconButton>
        </div>
      </CardActions>

      {showComments && (
        <section>
          <div className="flex items-center space-x-5 mx-3 my-5">
            <Avatar />

            <input
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleCreateComment(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full outline-none bg-transparent border border-[#3b4054] rounded-full px-5 py-2"
              type="text"
              placeholder="write your comment..."
            />
          </div>
          <Divider />

          <div className="mx-3 space-y-2 my-5 text-xs">
            {Array.isArray(item.comments) && item.comments.map((comment) => (
              <div className="flex items-center space-x-5" key={comment.id || comment.content}>
                <Avatar sx={{ height: "2rem", width: "2rem", fontSize: ".8rem" }}>
                  {comment.user?.firstName?.[0] || 'U'}
                </Avatar>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
};

export default PostCard;
