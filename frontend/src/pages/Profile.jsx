import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { MdDelete } from "react-icons/md";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;

            try {
                const { data } = await axios.get('http://localhost:8000/api/posts', {
                    headers: {
                        'Authorization': `Bearer ${cookies['token']}`
                    }
                });
                const userPosts = data.posts.filter((item) => item.author._id === user._id);
                setPosts(userPosts);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user, cookies]);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:8000/api/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${cookies['token']}`
                }
            });
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        } catch (error) {
            console.log('Error deleting post:', error);
        }
    };

    return (
        <div className="max-w-full text-white mx-auto p-4">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div style={{ fontFamily: 'fantasy' }} className="bg-sky-800 mb-4 rounded p-5 px-20">
                        <h2>Username : {user?.username}</h2>
                        <h2>Email : {user?.email}</h2>
                    </div>
                    <div className="min-w-full flex flex-wrap gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post._id} className="bg-white relative w-60 shadow-lg rounded-lg overflow-hidden mb-6">
                                    <img
                                        className="w-full object-cover"
                                        src={post.image}
                                        alt="Post content"
                                    />
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-200">
                                        <MdDelete className="text-red-500" />
                                    </button>
                                </div>

                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
