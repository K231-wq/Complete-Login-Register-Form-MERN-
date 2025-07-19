import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const EmailVerify = () => {
    const navigate = useNavigate();

    const inputRefs = useRef([]);
    const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');
            console.log("OTP Array: " + otpArray);
            console.log("Otp: " + otp);
            const { data } = await axios.post(backendUrl + "/api/v1/auth/verify-otp", { otp });
            if (data.success) {
                toast.success(data.message);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (isLoggedIn && userData && userData.isAccountVerified) {
            toast.success("Email has already verified!");
            setTimeout(() => {
                navigate('/');
            }, 1000)
        }
    }, [isLoggedIn, userData]);
    return (
        <div className='flex items-center justify-center min-h-screen psx-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="Logo Image" className='absolute left-5 sm:left-6 top-2 w-32 cursor-pointer' />
            <form action="" className='bg-slate-900 p-8 rounded-lg shadow-lg w-120 text-sm' onSubmit={submitHandler}>
                <h1 className='text-center font-bold text-2xl text-white mb-4 hover:scale-105 transition-all duration-300 cursor-default'>Email Verify OTP</h1>
                <p className='text-indigo-600 text-center text-sm font-semibold mb-8 hover:text-indigo-200'>Enter the 6-digit code sent to your email account</p>
                <div className='m-auto flex justify-between mb-8' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input type="text"
                            maxLength={1}
                            key={index}
                            required
                            className='w-15 h-15 bg-[#333A5C] text-wrap text-center text-xl rounded-md text-white'
                            ref={e => inputRefs.current[index] = e}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <button className='w-full py-3 bg-gradient-to-l from-blue-800 to-blue-500 rounded-2xl font-semibold text-white cursor-pointer shadow-md shadow-blue-400 hover:scale-105 hover:shadow-lg transition-all duration-200'>Verify Email</button>
            </form>
        </div>
    )
}

export default EmailVerify