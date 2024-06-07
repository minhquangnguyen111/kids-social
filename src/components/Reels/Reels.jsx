import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReelsAction } from './../../Redux/Reels/reels.action';
import { Avatar, Card, CardHeader } from '@mui/material';

const Reels = () => {
    const dispatch = useDispatch();
    const { reels, error } = useSelector(state => state.reels);
    const videosRef = useRef([]);

    useEffect(() => {
        dispatch(getAllReelsAction());
    }, [dispatch]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // 50% of the video visible in viewport
        };

        const handleIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play().catch(error => console.log(error));
                } else {
                    entry.target.pause();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, options);

        videosRef.current.forEach(video => {
            observer.observe(video);
        });

        return () => {
            observer.disconnect();
        };
    }, [reels]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div className='absolute left-[30%] '>
                <span> </span>
            </div>
            <div className=" ">
                {reels.map((reel, index) => (
                    <div key={reel.id} className="relative reel-container mt-4 ">
                        <video controls ref={el => videosRef.current[index] = el} loop className="w-[27rem] rounded-xl">
                            <source src={reel.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className=''>
                            <div className='absolute bottom-32 start-3 -mb-5 '>
                                <CardHeader className='-ml-3 '
                                    avatar={
                                        <Avatar
                                            sx={{
                                                width: "3rem",
                                                height: "3rem",
                                                fontSize: ".5rem",
                                                bgcolor: "#191c29",
                                                color: "rgb(88,199,250)"
                                            }}
                                            src={reel.user.avatar}
                                        >

                                        </Avatar>
                                    }
                                    title={
                                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                                            {reel.user.firstName + " " + reel.user.lastName + `   •`}
                                        </p>
                                    }
                                    subheader={
                                        <p style={{ color: 'white' }} >
                                            {"@" + reel.user.email.split("@")[0]}
                                        </p>
                                    }
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 text-white px-2 py-1 bottom-24 start-3 -mb-5">
                                <p style={{ fontSize: '1rem' }}>{reel.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reels;