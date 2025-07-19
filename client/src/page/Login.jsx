import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const navigate = useNavigate();

    const { backendUrl, isLoggedIn, setIsLoggedIn, getUserData } = useContext(AppContext);

    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submitBtnHandler(e) {
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;
            if (state === "Sign Up") {
                console.log("Backend url: " + backendUrl + "/api/v1/auth/register");
                console.log("isLoggedIn: " + isLoggedIn)
                console.log("name: " + name + "\n" + "email" + email + "\n" + "Password: " + password);

                const { data } = await axios.post(backendUrl + "/api/v1/auth/register", {
                    name, email, password
                });
                console.log(data);
                if (data.success) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/')
                } else {
                    toast.error(data.message);
                }
            } else {
                console.log("Backend url: " + backendUrl + "/api/v1/auth/login");
                console.log("isLoggedIn: " + isLoggedIn)
                console.log("email" + email + "\n" + "Password: " + password);

                const { data } = await axios.post(backendUrl + "/api/v1/auth/login", {
                    email, password
                });
                console.log(data);
                if (data.success) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate('/')
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }

    }
    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="Logo Image" className='absolute left-5 sm:left-6 top-2 w-32 cursor-pointer' />
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-105 text-indigo-300 text-sm transition-all duration-300'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>
                    {state === "Sign Up" ? "Create Account" : "Login Account"}
                </h2>
                <p className='text-center text-sm mb-6'>
                    {state === "Sign Up" ? "Create Your Account" : "Login Your Account"}
                </p>
                <form action="" onSubmit={submitBtnHandler}>
                    {state === 'Sign Up' && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.person_icon} alt="Perosn's icon" />
                            <input type="text"
                                placeholder='Full Name'
                                required
                                className='bg-transparent outline-none text-white'
                                onChange={(e) => setName(e.target.value)}
                                value={name} />
                        </div>
                    )}


                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="Mail icon" />
                        <input type="email"
                            placeholder='Email Account'
                            required
                            className='bg-transparent outline-none text-white'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email} />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="Password icon" />
                        <input type="password"
                            placeholder='Password' required
                            className='bg-transparent outline-none text-white'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password} />
                    </div>
                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 hover:text-indigo-600 cursor-pointer'>Forgot password?</p>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800 font-semibold text-white cursor-pointer shadow-md shadow-indigo-400 hover:shadow-lg hover:scale-105 transition-all duration-200'>{state}</button>
                </form>
                {state === 'Sign Up' ? (
                    <p className='text-center text-sm mt-4 text-gray-400'>
                        Already have an account?{' '}
                        <span
                            onClick={() => setState("Login")}
                            className='text-blue-400 cursor-pointer underline'>Login here</span>
                    </p>
                ) : (
                    <p className='text-center text-sm mt-4 text-gray-400'>
                        Don't have an account?{' '}
                        <span
                            onClick={() => setState("Sign Up")}
                            className='text-blue-400 cursor-pointer underline'>Sign up</span>
                    </p>
                )}


            </div>
        </div>
    )
}

export default Login