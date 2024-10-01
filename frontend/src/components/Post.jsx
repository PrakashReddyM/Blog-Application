import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaComment, FaBookmark } from 'react-icons/fa';
import { useCookies } from 'react-cookie';

const Post = ({ postId, username, comments, profileImage, postImage, likes, user, setPosts }) => {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['token']);
    const [error, setError] = useState('');
    const [commentReal,setCommentReal] = useState(comments)
    const [showComments, setShowComments] = useState(false);
    const [isLiked,setIsLiked] = useState(likes.includes(user._id));
    const [likeCount,setLikeCount] = useState(likes.length)

    const toggleLike = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(`http://localhost:8000/api/post-like/${postId}`, { userId: user._id }, {
                headers: {
                    'Authorization': `Bearer ${cookies['token']}`
                }
            });

            if (data.success) {
                setIsLiked(prev=> !prev) 
                setLikeCount(data.post.likes.length)   
            }
        } catch (error) {
            console.log('Error in Liking:', error);
            setError('Error occurred while liking the post');
        } finally {
            setLoading(false);
        }
    };

    const handleComment = async () => {
        try {
            const { data } = await axios.post(`http://localhost:8000/api/posts/${postId}/comments`, { text: text }, {
                headers: {
                    'Authorization': `Bearer ${cookies['token']}`
                }
            })
            setText('');
            setCommentReal(data.post.comments)
        } catch (error) {
            setError('error while commenting')
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
            <div className="flex items-center px-4 py-3">
                <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={profileImage}
                    alt={`${username}'s profile`}
                />
                <div className="ml-3">
                    <p className="font-semibold text-gray-900">{username}</p>
                </div>
            </div>

            <img
                className="w-full object-cover"
                src={postImage}
                alt="Post content"
            />

            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex space-x-4">
                        <button className="focus:outline-none" onClick={toggleLike} disabled={loading}>
                            <FaHeart className={`h-6 w-6 transition-colors duration-200 ${isLiked ? 'text-red-500' : 'text-gray-700'}`} />
                        </button>
                        <button className="focus:outline-none">
                            <FaComment className="h-6 w-6 text-gray-700 hover:text-blue-500 transition-colors duration-200" />
                        </button>
                    </div>
                    <button className="focus:outline-none">
                        <FaBookmark className="h-6 w-6 text-gray-700 hover:text-yellow-500 transition-colors duration-200" />
                    </button>
                </div>

                <div>
                    <p className="text-sm font-semibold">{likeCount} likes</p>
                </div>
                <div className="flex gap-4 mt-2">
                    <input
                        className="outline-none border-b-2 font-mono text-sm text-black rounded-sm w-full border-black"
                        name="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        type="text"
                        placeholder="Add comment"
                    />
                    <button className="bg-sky-500 text-white rounded px-2 h-7 w-20 text-sm" onClick={handleComment}>
                        Post
                    </button>
                </div>
                {/* toggle */}
                <button
                    className='mt-4 text-xs flex w-full justify-end text-gray-700 hover:underline'
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments ? '... Hide Comments' : '... Read Comments'}
                </button>
                {showComments && (
                    <div className="mt-4">
                        {commentReal.length > 0 ? (
                            commentReal.map((comment) => (
                                <div key={comment._id} className="mb-4 flex justify-between">
                                    <p className="text-sm text-gray-600">{comment.text}</p> 
                                    <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</p> 
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No comments yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Post;
