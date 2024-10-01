import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { MdAddBox } from "react-icons/md";

const Sidebar = ({setShowLogin}) => {
    const location = useLocation();

    const handleLogout = ()=>{
        localStorage.removeItem('user');
        setShowLogin(true)
    }

    return (
        <div className="sidebar h-screen w-64 bg-gray-900 text-gray-100 flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2 py-4">
                    <li>
                        <Link
                            to="/"
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-700 ${
                                location.pathname === '/' ? 'bg-gray-700 text-white' : 'text-gray-400'
                            }`}
                        >
                            <GoHomeFill className="w-5 h-5 mr-3" />
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-700 ${
                                location.pathname === '/profile' ? 'bg-gray-700 text-white' : 'text-gray-400'
                            }`}
                        >
                            <CgProfile className="w-5 h-5 mr-3" />
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/post/new"
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-700 ${
                                location.pathname === '/post/new' ? 'bg-gray-700 text-white' : 'text-gray-400'
                            }`}
                        >
                            <div className="flex items-center mr-3">
                                <MdAddBox className="w-4 h-4 -ml-1" />
                            </div>
                            Create Post
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="p-4">
                <button onClick={handleLogout} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;