'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'

const BecomeAuthore = ({ button_link = '', button_name = '', description = '', title = '', video_embed_code = '', poster_image = {} }) => {

    const { authUser, openAuth } = useAuth();
    // const { openAuth, authLoading, isAuthenticated, logout, authUser } =
    // useAuth();
    const router = useRouter();

    const handleButtonClick = () => {
        if (authUser && authUser.username) {
            router.push(`/user/${authUser.username}/become-an-author`);
        } else {
            openAuth("login")
        }
    };

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleVideo = () => {
        const video = videoRef.current;
        if (video && video.paused) {
            video.play();
            setIsPlaying(true);
        } else if (video) {
            video.pause();
            setIsPlaying(false);
        }
    };

    // Fallback poster image
    const fallbackPoster = '/images/handshake.png';
    const posterUrl = poster_image?.url || fallbackPoster;

    return (
        <div className="container">

            <div className="flex items-center justify-start gap-[10px] mt-5">
                <Link href={`/`}><p className="p2 !text-primary">Home</p></Link>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                >
                    <g clipPath="url(#clip0_5255_184)">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                            fill="#505050"
                        />
                    </g>
                </svg>
                {title && <p className="p2">{title}</p>}
            </div>

            <section className="pb-[35px] lg:m-0 mt-5">
                <div className="flex md:flex-row flex-col-reverse xl:gap-20 lg:gap-12 sm:gap-8 gap-4 items-center">
                    <div className="md:w-1/2 w-full">
                        {title && <h1 className="sm:mb-[18px] mb-2">{title}</h1>}
                        {description && <p className="sm:mb-[30px] mb-[18px]">{description}</p>}
                        <div className="flex items-center flex-wrap sm:gap-4 gap-2">
                            {(button_link && button_name) && (
                                <button className="btn btn-primary" onClick={handleButtonClick}>
                                    {button_name}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full">
                        <div className="relative overflow-hidden">
                            {/* {video_embed_code ? (
                                <video
                                    ref={videoRef}
                                    className="w-full h-auto"
                                    onClick={toggleVideo}
                                    muted
                                    loop
                                    poster={posterUrl}
                                >
                                    <source
                                        src={video_embed_code}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={posterUrl}
                                    alt="Become an Author"
                                    className="w-full h-auto"
                                />
                            )} */}
                            {
                                posterUrl && (
                                    <img
                                        src={posterUrl}
                                        alt="Become an Author"
                                        className="w-full h-auto"
                                    />
                                )
                            }
                            {/* {!isPlaying && video_embed_code && (
                                <div className="absolute inset-0 flex items-center justify-center transition ">
                                    <button
                                        onClick={toggleVideo}
                                        className="rounded-full bg-white 1xl:w-16 1xl:h-16 xl:w-[60px] xl:h-[60px] w-14 h-14 flex items-center justify-center outline outline-[3px] outline-offset-4 outline-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="46"
                                            height="46"
                                            viewBox="0 0 46 46"
                                            className="fill-primary stroke-primary 1xl:w-[46px] 1xl:h-[46px] w-11 h-11"
                                        >
                                            <path
                                                d="M17 11.5L36.1667 23L17 34.5V11.5Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BecomeAuthore
