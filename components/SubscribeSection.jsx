'use client';

import { themeConfig } from '@/config/theamConfig';
import { strapiPost } from '@/lib/api/strapiClient';
import Link from 'next/link';
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
            setloading(false);
        }

        if (valid) {
            try {
                const response = await strapiPost("contact-requests", { email, type: 'subscribe' })

                if (response) {
                    if (response.data) {
                        setSuccsessMessage(response.message)
                        // ✅ Reset form fields
                        setEmail('');
                        setCheckboxChecked(false);
                        setTimeout(() => {
                            setSuccsessMessage(null)
                        }, 2000);
                    } else {
                        setEmailError(response.message)
                    }
                }
            } catch (error) {
                console.log(error, 'error')
            } finally {
                console.log('finally')
                setloading(false);
            }
        }
    };

    return (
        <div className="xl:pt-[35px] sm:pt-[30px] pt-5 relative">
            <div className="w-full bg-primary py-10">
                <div className="container mx-auto">
                    <div className="mx-auto flex flex-col lg:flex-row items-center justify-between 2xl:gap-[230px] xl:gap-[140px] lg:gap-[65px] sm:gap-6 gap-4">
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
                                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
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
                                            <label htmlFor='terms' className="p italic !text-white cursor-pointer">I accept the <Link href="/terms-of-service" className="underline underline-offset-1">Terms of Service</Link> and <Link href="/privacy-policy" className="underline underline-offset-1">Privacy Policy</Link>.</label>
                                        </div>
                                    )}
                                    {checkboxError && (
                                        <p className="text-red-500 text-sm mt-1">{checkboxError}</p>
                                    )}

                                    {
                                        succsessMessage && (
                                            <p className="text-green-500 text-sm mt-1">{succsessMessage}</p>
                                        )
                                    }
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscribeSection;