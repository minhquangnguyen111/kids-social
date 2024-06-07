import React from 'react';
import { Card } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import './Authentication.css';

const Authentication = () => {
    return (
        <div className="relative w-screen h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://res.cloudinary.com/datbut4zs/image/upload/v1717646331/gnxylomk9mbijljqo6hf.jpg')" }}>
            <div className="absolute inset-0 flex justify-center items-center  ">
                <Card className="w-full max-w-md p-8">
                    <div className="flex flex-col items-center mb-5 space-y-1">
                        <span className='text text-center text-xs pt-2 pb-2'>KIDS SOCIAL</span>
                        <p className="text-center text-base  w-full text-purple-500">Online social networking site - Create your new world.</p>
                    </div>
                    <Routes >
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Card>
            </div>
        </div>
    );
}

export default Authentication;
