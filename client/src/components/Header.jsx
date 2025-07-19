import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';

const Header = () => {
    const { userData } = useContext(AppContext);
    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <img src={assets.header_img} alt="Header's Image" className="w-36 h-36 rounded-full mb-6" />
            <h1 className='flex flex-row items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {!userData.name ? "Developer" : userData.name}
                <img className='w-8 aspect-square' src={assets.hand_wave} alt="Hand Wave icon" />
            </h1>

            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
            <p className='mb-8 max-w-lg'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam dignissimos mollitia doloremque, impedit quod illo eos dolorem, omnis excepturi sequi sint voluptas ipsa quo provident? Magnam quos laborum rerum suscipit?</p>
            <button className='font-semibold border border-gray-500 rounded-full text-black px-8 py-3 cursor-pointer shadow-md shadow-gray-500 hover:text-white hover:bg-gray-900 hover:border-gray-400 hover:shadow-xl hover:scale-110 transition-all duration-300'>Get Started</button>
        </div>
    )
}

export default Header