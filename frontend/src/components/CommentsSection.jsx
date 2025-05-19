import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaTrash, 
  FaEdit, 
  FaReply, 
  FaHeart, 
  FaRegHeart, 
  FaEllipsisH, 
  FaPaperPlane, 
  FaSmile,
  FaUser 
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Comment = ({ 
  comment, 
  depth = 0, 
  onDelete, 
  onLike, 
  onReply, 
  onEdit, 
  isOwner,
  isLiked,
  currentUser,
  isPostOwner
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment?.content || '');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!comment?.id) {
      console.error('Cannot edit - comment ID missing');
      return;
    }
    await onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!comment?.id || !replyContent.trim()) return;
    await onReply(comment.id, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  const renderAvatar = (user, size = 'md') => {
    const sizes = {
      sm: { container: 'w-6 h-6', icon: 12 },
      md: { container: 'w-8 h-8', icon: 14 },
      lg: { container: 'w-10 h-10', icon: 16 }
    };

    return user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={user.firstName || 'User'}
        className={`rounded-full object-cover ${sizes[size].container}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '';
          e.target.style.display = 'none';
        }}
      />
    ) : (
      <div className={`${sizes[size].container} rounded-full bg-gray-200 flex items-center justify-center`}>
        <FaUser className="text-gray-500" size={sizes[size].icon} />
      </div>
    );
  };

  if (!comment?.id) {
    console.error('Rendering invalid comment:', comment);
    return null;
  }

  return (
    <div className={`mt-3 ${depth > 0 ? 'ml-8 pl-3 border-l-2 border-gray-200' : ''}`}>
      <div className="flex items-start">
        {renderAvatar(comment.user)}
        
        <div className="flex-1">
          <div className={`bg-gray-50 rounded-lg p-3 ${isPostOwner ? 'border-l-4 border-blue-500' : ''}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="font-semibold text-sm">
                  {comment.user?.firstName || 'Anonymous'}
                </span>
                {isPostOwner && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Post Owner
                  </span>
                )}
                <span className="text-gray-500 text-xs ml-2">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              {currentUser && (
                <div className="relative">
                  <button 
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaEllipsisH size={12} />
                  </button>
                  
                  {showOptions && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            setShowReplyForm(true);
                            setShowOptions(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaReply className="mr-2" size={12} />
                          Reply
                        </button>
                        {isOwner && (
                          <>
                            <button 
                              onClick={() => {
                                setIsEditing(true);
                                setShowOptions(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FaEdit className="mr-2" size={12} />
                              Edit
                            </button>
                            <button 
                              onClick={() => {
                                if (comment.id) onDelete(comment.id);
                                setShowOptions(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <FaTrash className="mr-2" size={12} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmitEdit} className="mt-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  autoFocus
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-3 py-1 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-1 text-sm">{comment.content}</p>
            )}
          </div>
          
          <div className="flex items-center mt-1 space-x-4 text-xs">
            <button 
              onClick={() => {
                if (!comment.id) {
                  console.error('Like failed - missing comment ID:', comment);
                  return;
                }
                onLike(comment.id);
              }}
              className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              {isLiked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
              <span className="ml-1">{comment.likes?.length || 0}</span>
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <FaReply className="mr-1" size={12} />
              Reply
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-3 flex items-start">
              {renderAvatar(currentUser, 'sm')}
              <form onSubmit={handleSubmitReply} className="flex-1 flex items-center">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                <button type="button" className="text-gray-400 hover:text-gray-600 mx-2">
                  <FaSmile size={14} />
                </button>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className={`p-1 rounded-full ${replyContent.trim() ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400'}`}
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = ({ postId, onCommentAdded, onCommentDeleted }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPostOwner, setIsPostOwner] = useState(false);
  const { user } = useAuth();

  const renderAvatar = (userData, size = 'md') => {
    const sizes = {
      sm: { container: 'w-6 h-6', icon: 12 },
      md: { container: 'w-8 h-8', icon: 14 },
      lg: { container: 'w-10 h-10', icon: 16 }
    };

    return userData?.profileImage ? (
      <img
        src={userData.profileImage}
        alt={userData.firstName || 'User'}
        className={`rounded-full object-cover ${sizes[size].container}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '';
          e.target.style.display = 'none';
        }}
      />
    ) : (
      <div className={`${sizes[size].container} rounded-full bg-gray-200 flex items-center justify-center`}>
        <FaUser className="text-gray-500" size={sizes[size].icon} />
      </div>
    );
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
      
      // Normalize comments data to use id instead of _id
      const normalizeComments = (comments) => {
        return comments.map(comment => {
          // Use id if available, otherwise use _id
          const commentId = comment.id || comment._id;
          if (!commentId) {
            console.error('Found comment without ID:', comment);
            return null; // Skip invalid comments
          }
          
          const normalizedComment = {
            ...comment,
            id: commentId,
            // Remove _id if it exists to avoid confusion
            ...(comment._id && { _id: undefined })
          };
          
          if (comment.replies) {
            normalizedComment.replies = normalizeComments(comment.replies);
          }
          
          return normalizedComment;
        }).filter(comment => comment !== null); // Filter out any null comments
      };

      const normalizedComments = normalizeComments(response.data.comments || []);
      console.log('Normalized comments:', normalizedComments);
      
      setComments(normalizedComments);
      
      if (user && response.data.user) {
        setIsPostOwner(user.id === response.data.user.id);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, user]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to comment');
        return;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.post(
        `http://localhost:8080/api/comments/post/${postId}`,
        { content: newComment },
        { headers: { Authorization: authToken } }
      );

      // Ensure the new comment has an id field
      const newCommentWithId = {
        ...response.data,
        id: response.data.id || response.data._id,
        ...(response.data._id && { _id: undefined })
      };

      setComments(prev => [newCommentWithId, ...prev]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error posting comment:', err);
      setError(err.response?.data?.message || 'Error posting comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId || !window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: { Authorization: authToken }
      });
      
      const deleteCommentAndReplies = (comments) => {
        return comments.filter(c => c.id !== commentId)
                     .map(c => {
                       if (c.replies) {
                         return {
                           ...c,
                           replies: deleteCommentAndReplies(c.replies)
                         };
                       }
                       return c;
                     });
      };
      
      setComments(prev => deleteCommentAndReplies(prev));
      if (onCommentDeleted) onCommentDeleted();
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err.response?.data?.message || 'Error deleting comment. Please try again.');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!commentId || commentId.startsWith('temp-')) {
      console.error('Like attempt with invalid comment ID:', commentId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to like comments');
        return;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.put(
        `http://localhost:8080/api/comments/like/${commentId}`,
        {},
        { headers: { Authorization: authToken } }
      );
      
      const updateCommentsWithLike = (comments) => {
        return comments.map(c => {
          if (c.id === commentId) {
            return {
              ...response.data,
              id: response.data.id || response.data._id,
              ...(response.data._id && { _id: undefined })
            };
          }
          if (c.replies) {
            return {
              ...c,
              replies: updateCommentsWithLike(c.replies)
            };
          }
          return c;
        });
      };
      
      setComments(prev => updateCommentsWithLike(prev));
    } catch (err) {
      console.error('Error liking comment:', err);
      setError(err.response?.data?.message || 'Error liking comment. Please try again.');
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!commentId || !newContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.put(
        `http://localhost:8080/api/comments/${commentId}`,
        { content: newContent },
        { headers: { Authorization: authToken } }
      );
      
      const updateCommentsWithEdit = (comments) => {
        return comments.map(c => {
          if (c.id === commentId) {
            return {
              ...response.data,
              id: response.data.id || response.data._id,
              ...(response.data._id && { _id: undefined })
            };
          }
          if (c.replies) {
            return {
              ...c,
              replies: updateCommentsWithEdit(c.replies)
            };
          }
          return c;
        });
      };
      
      setComments(prev => updateCommentsWithEdit(prev));
    } catch (err) {
      console.error('Error editing comment:', err);
      setError('Error editing comment. Please try again.');
    }
  };

  const handleReplyToComment = async (parentCommentId, replyContent) => {
    if (!parentCommentId || !replyContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const response = await axios.post(
        `http://localhost:8080/api/comments/reply/${parentCommentId}`,
        { content: replyContent },
        { headers: { Authorization: authToken } }
      );

      const addReplyToComment = (comments) => {
        return comments.map(c => {
          if (c.id === parentCommentId) {
            const newReply = {
              ...response.data,
              id: response.data.id || response.data._id,
              ...(response.data._id && { _id: undefined })
            };
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          if (c.replies) {
            return {
              ...c,
              replies: addReplyToComment(c.replies)
            };
          }
          return c;
        });
      };
      
      setComments(prev => addReplyToComment(prev));
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      console.error('Error posting reply:', err);
      setError('Error posting reply. Please try again.');
    }
  };

  const renderComments = (commentsList, parentId = null, depth = 0) => {
    return commentsList
      .filter(comment => {
        if (!comment) return false;
        if (parentId === null) return !comment.parentComment;
        return comment.parentComment === parentId;
      })
      .map(comment => {
        if (!comment?.id) {
          console.error('Invalid comment in render:', comment);
          return null;
        }

        const isOwner = user && comment.user && user.id === comment.user.id;
        const isLiked = user && comment.likes && comment.likes.some(u => u.id === user.id);
        const commentIsPostOwner = comment.user?.id === comments.find(c => !c?.parentComment)?.user?.id;
        
        return (
          <React.Fragment key={comment.id}>
            <Comment
              comment={comment}
              depth={depth}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
              onReply={handleReplyToComment}
              onEdit={handleEditComment}
              isOwner={isOwner}
              isLiked={isLiked}
              currentUser={user}
              isPostOwner={commentIsPostOwner}
            />
            {comment.replies && renderComments(comment.replies, comment.id, depth + 1)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="mt-2">
      {user && (
        <div className="flex items-start mb-4">
          {renderAvatar(user)}
          <form onSubmit={handleSubmitComment} className="flex-1 flex items-center bg-gray-100 rounded-full px-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent py-2 text-sm focus:outline-none"
              required
            />
            <button type="button" className="text-gray-400 hover:text-gray-600 mx-2">
              <FaSmile size={16} />
            </button>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`p-2 rounded-full ${newComment.trim() ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400'}`}
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {loading ? (
          <div className="text-center py-4">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            {user ? "No comments yet. Be the first to comment!" : "No comments yet."}
          </div>
        ) : (
          renderComments(comments)
        )}
      </div>

      {error && (
        <div className="mt-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      <br/><br/><br/><br/>
    </div>
  );
};

export default CommentsSection;
