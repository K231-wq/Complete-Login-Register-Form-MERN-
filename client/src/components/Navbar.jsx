import React, { useContext } from 'react'
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext);

    const sendVerificationOtp = async () => {
        try {
            const { data } = await axios.post(backendUrl + "/api/v1/auth/send-verify-otp");
            console.log("Email send OTP: " + data);
            if (data.success) {
                toast.success(data.message);
                setTimeout(() => {
                    navigate('/email-verify');
                }, 3000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + "/api/v1/auth/logout");
            data.success && setIsLoggedIn(false)
            data.success && setUserData(false)
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='w-full flex justify-between items-center px-4 py-1 sm:p-2 sm:px-6 absolute top-0'>
            <img src={assets.logo} alt="Icon" className='w-28 sm:w-32' />
            {userData ?
                <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white shadow-md shadow-gray-800 relative group hover:shadow-xl hover:scale-100 transition-all duration-150 cursor-pointer'>
                    {userData.name[0].toUpperCase()}
                    <div className='absolute hidden group-hover:block top-0 right-4 z-10 text-black rounded pt-10 sm:w-36'>
                        <ul className='flex flex-col justify-center text-center items-center list-none m-0 p-4 bg-gray-100 shadow-lg shadow-gray-700 text-sm rounded-md gap-y-1'>
                            {!userData.isAccountVerified && (
                                <li onClick={sendVerificationOtp} className='w-full py-1 px-2 hover:bg-gray-600 cursor-pointer rounded-lg hover:text-white hover:scale-110 transition-all duration-150'>
                                    Verify email
                                </li>
                            )}
                            <li onClick={logout} className='w-full py-1 px-2 hover:bg-gray-600 cursor-pointer rounded-lg hover:text-white hover:scale-110 transition-all duration-150'>Logout</li>
                        </ul>
                    </div>
                </div>
                :
                <button onClick={() => navigate('/login')} className='flex items-center font-semibold gap-2 border border-gray-500 rounded-full px-6 py-2 bg-white text-black shadow-sm shadow-gray-500 hover:bg-indigo-500 hover:text-white hover:scale-110 hover:transition-all hover:border-white hover:shadow-xl cursor-pointer transition-all duration-300'>Login <img src={assets.arrow_icon} alt="Login Icon" /></button>
            }

        </div>
    )
}

export default Navbar