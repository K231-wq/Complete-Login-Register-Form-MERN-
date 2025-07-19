import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);
    axios.defaults.withCredentials = true;

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const inputRefs = useRef([]);

    const handleInputs = (e, index) => {
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

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + "/api/v1/auth/send-reset-otp", { email });
            console.log(data);
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && setIsEmailSent(true)
        } catch (error) {
            toast.error(error.message);
        }

    }
    const onSubmitOTP = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
    }
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            console.log("OTP: " + otp);
            console.log("New password " + newPassword);
            const { data } = await axios.post(backendUrl + "/api/v1/auth/reset-password", {
                email, otp, newPassword
            })
            data.success ? toast.success(data.message) : toast.error(data.message)
            data.success && navigate('/login')
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className='flex items-center justify-center min-h-screen psx-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="Logo Image" className='absolute left-5 sm:left-6 top-2 w-32 cursor-pointer' />
            {/*Enter Email account to reset password */}
            {!isEmailSent && (
                <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-center text-white text-2xl font-bold mb-4 hover:scale-110 transition-all duration-200 cursor-default'>Reset Password</h1>
                    <p className='text-center text-indigo-300 hover:text-indigo-600 mb-6 transition-colors duration-200'>Enter your registered email account</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] m-auto hover:scale-105 transition-all duration-200 cursor-pointer caret-white'>
                        <img src={assets.mail_icon} alt="Email's icon" />
                        <input type="email"
                            placeholder='Email'
                            id="Email id"
                            className='outline-none bg-transparent text-white'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <button className='mt-6 flex justify-center items-center text-center font-semibold shadow-md shadow-cyan-400 bg-gradient-to-r from-cyan-400 to-cyan-700 w-42 m-auto py-2 rounded-full text-white cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300'>Submit</button>
                </form>
            )}
            {/*Enter otp form to reset password */}
            {!isOtpSubmitted && isEmailSent && (
                <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg shadow-lg shadow-slate-500 w-96 text-sm'>
                    <h1 className='text-center text-2xl font-bold text-white mb-2 hover:scale-105 transition-all duration-200 cursor-default'>Reset password OTP</h1>
                    <p className='text-center text-indigo-400 text-sm mb-6 hover:text-indigo-700 transition-colors duration-150'>Enter the 6-digit code sent to your email</p>
                    <div className='m-auto flex justify-between mb-8' onPaste={handlePaste}>
                        {
                            Array(6).fill(0).map((_, index) => (
                                <input type="text"
                                    maxLength={1}
                                    key={index}
                                    className='w-12 h-12 bg-[#333A5C] rounded-lg text-wrap text-center text-white font-semibold hover:scale-110 transition-all duration-300'
                                    required
                                    ref={(e) => inputRefs.current[index] = e}
                                    onInput={(e) => handleInputs(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))
                        }
                    </div>
                    <button className='mt-6 flex justify-center items-center text-center font-semibold shadow-md shadow-cyan-400 bg-gradient-to-r from-cyan-400 to-cyan-700 w-42 m-auto py-2 rounded-full text-white cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300'>Submit</button>
                </form>
            )}
            {/* Enter new password */}
            {isOtpSubmitted && isEmailSent && (
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 rounded-lg shadow-lg shadow-slate-500 w-96 p-6'>
                    <h1 className='text-center text-white text-2xl font-bold hover:scale-110 transition-all duration-200 cursor-default mb-2'>New Password</h1>
                    <p className='text-center text-indigo-400 text-sm font-semibold hover:text-indigo-700 transition-colors duration-200 mb-6'>Enter the new password below</p>
                    <div className='bg-[#333A5C] flex items-center gap-3 py-2 w-full px-5 m-auto rounded-full hover:scale-105 transition-all duration-300 caret-white cursor-pointer text-sm font-semibold'>
                        <img src={assets.lock_icon} alt="Password's icon" />
                        <input type="password"
                            placeholder='Password'
                            required
                            className='outline-none text-white bg-transparent'
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                    </div>
                    <button className='mt-6 flex justify-center items-center text-center font-semibold shadow-md shadow-cyan-400 bg-gradient-to-r from-cyan-400 to-cyan-700 w-42 m-auto py-2 rounded-full text-white cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300'>Submit</button>
                </form>
            )}
        </div>
    )
}

export default ResetPassword