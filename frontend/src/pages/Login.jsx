import axios from 'axios';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login = ({ setShowLogin, setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [_, setCookies] = useCookies(['token']);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (isLogin) {
                const { data } = await axios.post('http://localhost:8000/api/login', { email, password }, { withCredentials: true });
                console.log()
                setCookies('token', data.token);
                localStorage.setItem('user',JSON.stringify(data.user))
                setUser(data.user);
            } else {
                const { data } = await axios.post('http://localhost:8000/api/register', { username, email, password }, { withCredentials: true });
                setCookies('token', data.token);
                localStorage.setItem('user',JSON.stringify(data.user))
                setUser(data.user);
            }
            setUserName('');
            setEmail('');
            setPassword('');
            setShowLogin(false);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Enter Details Properly');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        {isLogin ? <>Sign in to your account</> : <>Sign up to your account</>}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        {isLogin ? <></> : (
                            <div>
                                <input
                                    id="usernname"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                                    placeholder="UserName"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                        )}
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLogin ? 'Sign in' : 'Sign Up'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            {isLogin ? (
                                <button
                                    className='text-indigo-400 hover:text-blue-700 font-bold w-full'
                                    type='button'
                                    onClick={() => setIsLogin(false)}
                                >
                                    Register Instead
                                </button>
                            ) : (
                                <button
                                    className='text-blue-500 hover:text-blue-700 font-bold w-full'
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login Instead
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
