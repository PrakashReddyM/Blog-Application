import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [cookies] = useCookies(['token']);
  const [error, setError] = useState(null); 

  const profileImage = 'https://avatar.iran.liara.run/public/boy'; 

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/posts', {
                headers: {
                    'Authorization': `Bearer ${cookies['token']}`
                }
            });

            const sortedPosts = data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    fetchPosts();
}, []);


  return (
    <div className="mt-4 ml-48 min-h-screen flex justify-center">
      <div className="max-w-2xl w-96">
        {error ? ( 
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Post
                setPosts={setPosts}
                key={post._id}
                postId={post._id}
                user={post.author}
                username={post.author.username}
                profileImage={profileImage}
                postImage={post.image}
                likes={post.likes}
                comments ={post.comments}
                caption={post.caption || "No caption available"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
