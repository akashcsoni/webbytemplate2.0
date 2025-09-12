'use client';

import { strapiPost } from '@/lib/api/strapiClient';
import React, { useState } from 'react';

const SubscribeSection = ({
    title = 'Stay Updated!',
    label = 'Subscribe to our newsletter for the latest updates.',
    check_box = 'I accept the Terms of Service and <a href="/privacy-policy" className="underline">Privacy Policy</a>.',
    email_input = true,
}) => {

    const [loading, setloading] = useState(false)
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [succsessMessage, setSuccsessMessage] = useState('');
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [checkboxError, setCheckboxError] = useState('');

    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleSubmit = async (e) => {

        setloading(true);

        e.preventDefault();

        let valid = true;

        // Reset errors
        setEmailError('');
        setCheckboxError('');

        // Validate email
        if (!email.trim()) {
            setEmailError('Email is required.');
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        }

        // Validate checkbox
        if (!checkboxChecked) {
            setCheckboxError('You must accept the terms.');
            valid = false;
        }

        // If not valid, stop loading and return
        if (!valid) {
            setloading(false);
            return;
        }

        if (valid) {
            try {
                const response = await strapiPost("contact-requests", { email, type: 'subscribe' })

                if (response) {
                    if (response.data) {
                        setSuccsessMessage('Thank you for subscribing. Check your email for the confirmation message.')
                        // ✅ Reset form fields
                        setEmail('');
                        setCheckboxChecked(false);
                        // setTimeout(() => {
                        //     window.location.reload();
                        // }, 2000);
                    } else {
                        setEmailError(response.message)
                    }
                }
            } catch (error) {
                console.log(error, 'error')
            } finally {
                // console.log('finally')
                setloading(false);
            }
        }
    };

    return (
        <div className="xl:pt-[35px] sm:pt-[30px] pt-5 relative">
            <div className="w-full bg-primary py-10">
                <div className="container mx-auto">
                    <div className="mx-auto flex flex-col lg:flex-row items-center justify-between 2xl:gap-[230px] xl:gap-[140px] lg:gap-[65px] sm:gap-6 gap-4">
                        {succsessMessage ? (
                            <div className="w-full flex lg:flex-row flex-col justify-center items-center min-h-[120px] sm:gap-[18px] gap-3">
                                <svg className="1xl:w-12 1xl:h-12 sm:w-11 sm:h-11 w-10 h-10" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.7558 4.43385C22.167 3.98219 22.6679 3.62135 23.2265 3.37444C23.7852 3.12754 24.3892 3 25 3C25.6108 3 26.2148 3.12754 26.7735 3.37444C27.3321 3.62135 27.833 3.98219 28.2442 4.43385L30.4815 6.89056C30.9159 7.36746 31.4502 7.74269 32.0462 7.98951C32.6422 8.23633 33.2853 8.34867 33.9297 8.31852L37.2484 8.16498C37.8583 8.13624 38.4674 8.23512 39.0369 8.45528C39.6063 8.67545 40.1236 9.01205 40.5555 9.44355C40.9874 9.87505 41.3245 10.392 41.5452 10.9612C41.7659 11.5304 41.8654 12.1395 41.8372 12.7494L41.6815 16.0703C41.6513 16.7147 41.7637 17.3578 42.0105 17.9538C42.2573 18.5498 42.6325 19.0841 43.1094 19.5185L45.5661 21.7558C46.0178 22.167 46.3787 22.6679 46.6256 23.2265C46.8725 23.7852 47 24.3892 47 25C47 25.6108 46.8725 26.2148 46.6256 26.7735C46.3787 27.3321 46.0178 27.833 45.5661 28.2442L43.1094 30.4815C42.6325 30.9159 42.2573 31.4502 42.0105 32.0462C41.7637 32.6422 41.6513 33.2853 41.6815 33.9297L41.835 37.2484C41.8638 37.8583 41.7649 38.4674 41.5447 39.0369C41.3246 39.6063 40.988 40.1236 40.5565 40.5555C40.1249 40.9874 39.608 41.3245 39.0388 41.5452C38.4696 41.7659 37.8605 41.8654 37.2506 41.8372L33.9297 41.6815C33.2853 41.6513 32.6422 41.7637 32.0462 42.0105C31.4502 42.2573 30.9159 42.6325 30.4815 43.1094L28.2442 45.5661C27.833 46.0178 27.3321 46.3787 26.7735 46.6256C26.2148 46.8725 25.6108 47 25 47C24.3892 47 23.7852 46.8725 23.2265 46.6256C22.6679 46.3787 22.167 46.0178 21.7558 45.5661L19.5185 43.1094C19.0841 42.6325 18.5498 42.2573 17.9538 42.0105C17.3578 41.7637 16.7147 41.6513 16.0703 41.6815L12.7516 41.835C12.1417 41.8638 11.5326 41.7649 10.9631 41.5447C10.3937 41.3246 9.87644 40.988 9.44452 40.5565C9.0126 40.1249 8.67551 39.608 8.4548 39.0388C8.23409 38.4696 8.13463 37.8605 8.16278 37.2506L8.31852 33.9297C8.34867 33.2853 8.23633 32.6422 7.98951 32.0462C7.74269 31.4502 7.36746 30.9159 6.89056 30.4815L4.43385 28.2442C3.98219 27.833 3.62135 27.3321 3.37444 26.7735C3.12754 26.2148 3 25.6108 3 25C3 24.3892 3.12754 23.7852 3.37444 23.2265C3.62135 22.6679 3.98219 22.167 4.43385 21.7558L6.89056 19.5185C7.36746 19.0841 7.74269 18.5498 7.98951 17.9538C8.23633 17.3578 8.34867 16.7147 8.31852 16.0703L8.16498 12.7516C8.13624 12.1417 8.23512 11.5326 8.45528 10.9631C8.67545 10.3937 9.01205 9.87644 9.44355 9.44452C9.87505 9.0126 10.392 8.67551 10.9612 8.4548C11.5304 8.23409 12.1395 8.13463 12.7494 8.16278L16.0703 8.31852C16.7147 8.34867 17.3578 8.23633 17.9538 7.98951C18.5498 7.74269 19.0841 7.36746 19.5185 6.89056L21.7558 4.43385Z" stroke="#FFCC00" strokeWidth="2.3" />
                                    <path d="M18.418 25.0003L22.8049 29.3872L31.5789 20.6133" stroke="#FFCC00" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h2 className="lg:text-start text-center text-white 2xl:text-3xl 1xl:text-[32px] xl:text-[30px] sm:text-[27px] text-[22px] font-medium xl:leading-[45px] lg:leading-10 leading-8">{succsessMessage}</h2>
                            </div>
                        ) : (
                            <>
                                <div className="sm:max-w-[626px] w-full lg:text-start sm:text-center text-start">
                                    {title && <h2 className="text-white 2xl:mb-[18px] xl:mb-3 mb-2">{title}</h2>}
                                    {label && (
                                        <p className="text-white 2xl:text-lg text-base 2xl:leading-7 leading-6">{label}</p>
                                    )}
                                </div>

                                {email_input && (
                                    <div className="w-full 2xl:max-w-[600px] sm:max-w-[530px]">
                                        <form onSubmit={handleSubmit}>
                                            <div>
                                                <div className="flex border border-primary/10 rounded-lg bg-white overflow-hidden p-1 2xl:h-[58px] 1xl:h-[54px] lg:h-[50px] h-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your email here..."
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="flex-grow outline-none sm:px-4 px-1 text-gray-800 1xl:text-[17px] sm:text-base text-[15px] font-light w-full"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary font-medium whitespace-nowrap"
                                                    >
                                                        {loading ? "Processing..." : 'Subscribe'}
                                                    </button>
                                                </div>
                                                {emailError && (
                                                    <p className="text-red-500 text-sm mt-1 bg-white py-[2px] px-[11px] rounded-[5px] w-fit tracking-[0.5px]">{emailError}</p>
                                                )}
                                            </div>

                                            {check_box && (
                                                <div className="flex items-start gap-2 sm:mt-4 mt-2">
                                                    <input
                                                        type="checkbox"
                                                        id="terms"
                                                        checked={checkboxChecked}
                                                        onChange={(e) => setCheckboxChecked(e.target.checked)}
                                                        className="1xl:w-5 1xl:h-5 w-4 h-4 rounded-full accent-white mt-[3px]"
                                                    />
                                                    {
                                                        check_box && (
                                                            <div
                                                                dangerouslySetInnerHTML={{ __html: check_box }}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            )}
                                            {checkboxError && (
                                                <p className="text-red-500 text-sm mt-1 bg-white py-[2px] px-[11px] rounded-[5px] w-fit">{checkboxError}</p>
                                            )}
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribeSection;