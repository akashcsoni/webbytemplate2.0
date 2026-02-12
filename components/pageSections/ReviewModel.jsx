
"use client";

import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
} from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-stars";

export default function ReviewModal({ isOpen, onClose, product }) {
    const { authUser } = useAuth();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let tempErrors = {};

        if (!rating || rating === 0) {
            tempErrors.rating = "Please provide a rating.";
        }

        if (!review) {
            tempErrors.review = "Review is required.";
        } else if (review.length < 10) {
            tempErrors.review = "Review must be at least 10 characters.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const loginUser = authUser?.documentId;


    const handleSubmit = async () => {
        const isValid = validateForm();
        if (!isValid) {
            // toast.error("Please correct the errors before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderId = product?.order_id != null ? Number(product.order_id) : undefined;
            const productId = product?.product_id != null ? Number(product.product_id) : undefined;
            if (orderId == null || productId == null) {
                toast.error("Missing order or product information. Please try from the downloads list.");
                setIsSubmitting(false);
                return;
            }
            const payload = {
                rating: Number(rating),
                user: loginUser,
                review: review.trim(),
                order: orderId,
                product: productId,
            };

            const reviewData = await strapiPost(
                `product-reviews`,
                { data: payload },
                themeConfig.TOKEN
            );

            if (reviewData?.data) {
                toast.success("Review Submitted Successfully!");
                setRating(0);
                setReview("");
                setErrors({});
                onClose(); // ✅ Close modal after successful submit
            }
        } catch (err) {
            console.error("Failed to submit review:", err);
            toast.error("Review could not be submitted.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            size="2xl"
            placement="center"
            className="xl:max-w-[68%] sm:max-w-[75%] max-w-[93%] w-full"
            classNames={{
                closeButton: "text-black fill-black 2xl:top-9 lg:top-[34px] sm:top-[30px] top-[19px] sm:right-[30px] right-5 p-0",
            }}
        >
            <ModalContent>
                {() => (
                    <div className="">
                        {/* <div className="2xl:p-[30px] md:p-7 sm:p-5 p-4"> */}
                        {/* Header */}
                        <ModalHeader className="2xl:px-[30px] 1xl:px-7 xl:px-6 sm:px-5 px-4 2xl:py-[22px] lg:py-5 sm:py-4 py-3 border-b border-primary/10">
                            <h3>Write a Review</h3>
                        </ModalHeader>

                        {/* Body */}
                        <ModalBody className="p-0 gap-0 2xl:px-[30px] md:px-7 sm:px-5 px-4 1xl:py-[22px] sm:py-5 py-4 2xl:mt-2">
                            <p className="font-normal p2 2xl:mb-6 1xl:mb-[22px] md:mb-[18px] mb-3">
                                We would encourage honest review relating to product only.
                            </p>
                            {/* Star Rating */}
                            <div className="2xl:mb-6 1xl:mb-[22px] md:mb-[18px] mb-3">
                                <p className="font-normal p2 !text-black 2xl:mb-4 1xl:mb-3 md:mb-2 sm:mb-1 mb-0">
                                    Share Your Experience
                                </p>
                                <ReactStars
                                    count={5}
                                    value={rating}
                                    onChange={setRating}
                                    // size={37}
                                    color1="#0043A224"
                                    color2="#0043A2"
                                    className="gap-[10px] flex items-center leading-none reactstar"
                                />
                                {errors.rating && (
                                    <p className="p2 !text-red-500 mt-1">{errors.rating}</p>
                                )}
                            </div>

                            {/* Textarea */}
                            <div>
                                <div className="2xl:mb-[18px] sm:mb-2 mb-1">
                                    <p className="mb-2 font-normal text-black">Write Review</p>
                                    <textarea
                                        className="p2 md:h-[120px] h-[100px] w-full border border-[#D9DDE2] rounded-[5px] md:py-3 md:px-5 p-2 font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                                        // rows={10}
                                        placeholder="Write your product review here..."
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                    />
                                    {errors.review && (
                                        <p className="p2 !text-red-500 mt-1">{errors.review}</p>
                                    )}
                                </div>
                                <p className="p2 font-normal flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                                        <path d="M10.6667 12.6665L14 9.33317L10.6667 5.99984" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 9.33301L8.66667 9.33301C4.98467 9.33301 2 6.34834 2 2.66634L2 1.99967" stroke="#505050" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Once your review has been authorized, it will be visible on the product page.
                                </p>
                            </div>
                        </ModalBody>

                        {/* Footer */}
                        <div className="2xl:px-[30px] md:px-7 sm:px-5 px-4 1xl:py-[22px] lg:py-5 md:py-4 py-3">
                            <div className="flex items-center 1xl:gap-[18px] gap-3">
                                <Button
                                    onPress={handleSubmit}
                                    color="primary"
                                    className="w-fit btn btn-primary"
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Review"}
                                </Button>
                                <button className="btn btn-new">Cancel</button>
                            </div>
                            <div className="bg-blue-300/50 border border-blue-300 rounded-[5px] overflow-hidden 1xl:mt-5 mt-4">
                                <p className="p2 font-normal flex items-center gap-1 py-2 sm:px-3 px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary flex-shrink-0">
                                        <g clipPath="url(#clip0_9642_4405)">
                                            <path d="M10.0068 0.799805C10.3234 0.801583 10.6317 0.907744 10.9258 1.10156C11.1651 1.25919 11.4101 1.42706 11.6367 1.61914H11.6357C11.9897 1.91817 12.3895 1.99325 12.8564 1.91895C13.1086 1.87891 13.3631 1.85231 13.6152 1.83496C13.9622 1.81111 14.2836 1.86379 14.5625 2.0127C14.8425 2.16224 15.0648 2.40113 15.2266 2.72363C15.3784 3.02695 15.516 3.33719 15.6445 3.64844C15.7839 3.98601 16.0097 4.21406 16.3467 4.35254C16.6549 4.47904 16.9716 4.61169 17.2754 4.77246V4.77344C17.6007 4.94588 17.8431 5.16499 17.9932 5.44727C18.1429 5.72907 18.1903 6.05458 18.1602 6.41992V6.42285C18.1268 6.75303 18.0951 7.08786 18.0596 7.41992C18.028 7.71774 18.1009 7.97919 18.2812 8.21875L18.5498 8.57715C18.6394 8.69829 18.7281 8.82123 18.8135 8.94629C19.0597 9.3065 19.1996 9.64533 19.2002 10C19.2008 10.3546 19.062 10.6931 18.8174 11.0527C18.684 11.2488 18.5417 11.4523 18.3799 11.6406C18.0806 11.9887 18.0163 12.3879 18.0801 12.8652C18.1292 13.2326 18.1565 13.6087 18.1484 13.9824C18.1375 14.4933 17.864 14.89 17.4385 15.1289C17.0809 15.3297 16.7058 15.4969 16.3389 15.6553V15.6543C16.0077 15.7974 15.7832 16.021 15.6484 16.3506V16.3516C15.5354 16.627 15.4159 16.9057 15.2812 17.1777L15.2822 17.1787C15.0989 17.5496 14.8739 17.8234 14.5723 17.9893C14.271 18.1548 13.9189 18.1981 13.5078 18.1582H13.5068L12.5654 18.0635C12.2804 18.0353 12.0282 18.1053 11.7979 18.2773C11.5393 18.4705 11.278 18.6609 11.0146 18.8477C10.6864 19.0804 10.3444 19.2028 9.99316 19.2002C9.64236 19.1976 9.30281 19.07 8.97754 18.8398C8.78105 18.7008 8.56067 18.554 8.36328 18.3838C8.01493 18.084 7.61665 18.019 7.13965 18.0811C6.76622 18.1298 6.38416 18.1555 6.00488 18.1475C5.52478 18.1375 5.1463 17.8829 4.91016 17.4912C4.78079 17.2774 4.65782 17.0518 4.55566 16.8164L4.46094 16.5771C4.27172 16.0528 3.94032 15.7162 3.41797 15.542C3.18529 15.4642 2.96373 15.3562 2.75781 15.2471V15.2461C2.41631 15.0653 2.16201 14.8442 2.00684 14.5547C1.85169 14.265 1.80762 13.9293 1.84375 13.5449C1.87441 13.2181 1.90849 12.891 1.94141 12.5664C1.97029 12.2818 1.90053 12.0293 1.72949 11.7979C1.54476 11.5486 1.34651 11.2911 1.16699 11.0254C0.932985 10.6793 0.800452 10.349 0.799805 10.0039C0.799271 9.65893 0.929978 9.32865 1.16211 8.98242L1.38574 8.66211C1.46347 8.55582 1.54477 8.45066 1.63086 8.34961C1.88825 8.04729 1.96939 7.70686 1.93945 7.31445L1.91992 7.14258C1.87752 6.85642 1.84454 6.5637 1.83398 6.26953C1.82245 5.94772 1.88577 5.65364 2.03223 5.39941C2.17884 5.14492 2.40185 4.94248 2.69141 4.79395C3.00467 4.63347 3.32687 4.49038 3.64746 4.35645L3.76953 4.2998C4.04198 4.15768 4.23279 3.94877 4.35156 3.65527V3.6543C4.4617 3.38247 4.579 3.11031 4.70996 2.84375C4.89425 2.4676 5.11772 2.18903 5.41992 2.02051C5.72196 1.85215 6.07638 1.80808 6.49219 1.84668C6.81015 1.87618 7.13876 1.91226 7.45312 1.94238C7.72506 1.96828 7.96759 1.90073 8.19043 1.73828C8.47986 1.52763 8.77661 1.30093 9.08496 1.09668C9.38071 0.900743 9.69006 0.798097 10.0068 0.799805ZM9.99316 1.70996C9.86364 1.7109 9.7252 1.75466 9.57812 1.85547C9.32393 2.0297 9.07457 2.20525 8.83789 2.39258C8.30557 2.81471 7.70452 2.91193 7.07422 2.8252C6.79024 2.78583 6.50558 2.75544 6.22266 2.74121C6.07428 2.73376 5.95286 2.7617 5.85547 2.81641C5.75879 2.87081 5.6736 2.95833 5.60645 3.08984C5.48011 3.33824 5.35976 3.58069 5.26758 3.8291C5.0036 4.54212 4.51386 5.02397 3.7998 5.28223C3.67393 5.32776 3.54966 5.38114 3.42578 5.44043L3.05273 5.63086C2.837 5.74498 2.73584 5.93001 2.73926 6.18555C2.74217 6.39119 2.74924 6.58472 2.78516 6.76562C2.95598 7.62591 2.81743 8.42484 2.19043 9.10742C2.07627 9.23154 1.99446 9.3705 1.875 9.54102L1.87598 9.54199C1.76033 9.70726 1.71076 9.86047 1.71094 10.0029C1.71115 10.1453 1.76107 10.2977 1.87695 10.4619H1.87598C2.05335 10.7127 2.23631 10.96 2.4209 11.2061V11.207C2.73433 11.6262 2.89492 12.1016 2.8418 12.6406C2.80658 12.9999 2.76797 13.3605 2.73145 13.7188C2.71992 13.8958 2.75275 14.0347 2.81641 14.1436C2.88006 14.2523 2.98427 14.3473 3.14258 14.4238C3.37311 14.5353 3.58188 14.6441 3.80176 14.7227C4.52594 14.9808 5.01629 15.472 5.27539 16.1953C5.35279 16.411 5.45633 16.6169 5.5625 16.8428C5.64339 17.0147 5.74752 17.1221 5.86523 17.1855C5.9842 17.2496 6.13554 17.2781 6.32617 17.2607L6.69336 17.2246C6.8152 17.2115 6.93625 17.1971 7.05664 17.1797L7.29688 17.1543C7.85392 17.1164 8.38407 17.2408 8.85645 17.624H8.85547C9.05293 17.784 9.26 17.9353 9.47168 18.0791L9.63379 18.1797C9.78217 18.2626 9.89397 18.2954 9.99512 18.2959C10.1298 18.2964 10.2835 18.2404 10.5166 18.083C10.7469 17.9272 10.9664 17.7572 11.1973 17.583C11.6287 17.2575 12.1179 17.1019 12.668 17.1592L13.5908 17.2549L13.7686 17.2656C13.928 17.267 14.0379 17.2422 14.124 17.1953C14.2386 17.1329 14.3436 17.0139 14.4609 16.7783C14.5716 16.5556 14.6735 16.3284 14.7617 16.0977L14.8633 15.8652C15.1229 15.3453 15.5356 14.9781 16.0996 14.7637C16.3402 14.6723 16.5696 14.559 16.8193 14.4453C17.0025 14.3616 17.1153 14.2539 17.1807 14.1309C17.2468 14.0059 17.274 13.846 17.2529 13.6436C17.2286 13.4089 17.2112 13.1872 17.1777 12.9658L17.1494 12.7168C17.1081 12.1415 17.2416 11.5987 17.6387 11.1152H17.6396C17.7975 10.9232 17.9292 10.7242 18.0889 10.5088C18.2247 10.3253 18.2815 10.1567 18.2812 10C18.2809 9.84298 18.223 9.67385 18.0869 9.49023C17.9119 9.25393 17.7426 9.02113 17.5684 8.78809C17.2486 8.36054 17.0971 7.87612 17.1543 7.33301C17.1873 7.01898 17.22 6.70633 17.25 6.39355L17.2598 6.21973C17.2604 6.06256 17.2341 5.95478 17.1875 5.87012C17.1255 5.75751 17.0091 5.6533 16.7773 5.53711C16.5801 5.43825 16.383 5.34742 16.1836 5.27539C15.4617 5.01508 14.9708 4.52174 14.7148 3.79688V3.7959C14.6769 3.68873 14.632 3.58488 14.583 3.47949L14.4268 3.15234C14.3486 2.98717 14.2492 2.88148 14.1357 2.81836C14.0217 2.75488 13.8771 2.72549 13.6943 2.74023H13.6934C13.5649 2.75059 13.4369 2.76191 13.3096 2.77539L12.9287 2.82324C12.2797 2.91824 11.6697 2.80609 11.1309 2.37305C10.9019 2.18887 10.6582 2.01896 10.4082 1.85059H10.4072C10.2601 1.75134 10.1225 1.70905 9.99316 1.70996Z" fill="#0043A2" stroke="#0043A2" strokeWidth="0.4" />
                                            <path d="M12.4805 7.27734C13.1481 6.64105 14.1564 6.63872 14.7783 7.28418C15.3057 7.83063 15.3433 8.66471 14.8613 9.25195C14.7853 9.34465 14.7 9.42799 14.623 9.50195C13.1814 10.8854 11.7391 12.2694 10.2969 13.6523C9.92871 14.0053 9.52112 14.2 9.0957 14.2002C8.67047 14.2002 8.26295 14.0056 7.89355 13.6523H7.89258L5.28516 11.1504C4.84085 10.722 4.69129 10.1849 4.87988 9.60156L4.95801 9.40234C5.16617 8.95979 5.54963 8.67498 6.06348 8.57422H6.06445C6.62644 8.46442 7.11903 8.62989 7.51855 9.0127H7.51758C8.02771 9.50088 8.53861 9.98908 9.04785 10.4785L9.09668 10.5312C9.1111 10.5134 9.12665 10.4947 9.14453 10.4775C10.2541 9.40948 11.3649 8.34058 12.4805 7.27734ZM13.793 7.77832C13.5467 7.71232 13.3432 7.78176 13.1436 7.97363C11.9364 9.13601 10.7262 10.2956 9.5166 11.4551C9.40189 11.5651 9.26437 11.6706 9.09277 11.6699C8.92192 11.6691 8.78403 11.5632 8.66895 11.4531L7.56152 10.3906C7.29347 10.1341 7.04555 9.88252 6.77734 9.64453C6.58787 9.47643 6.37008 9.44401 6.12793 9.54785H6.12695C6.00657 9.59954 5.9253 9.66836 5.87207 9.74707C5.81872 9.82616 5.78551 9.92741 5.78125 10.0557C5.77691 10.2216 5.84915 10.3583 5.99707 10.5C6.86843 11.3322 7.73758 12.1671 8.60742 13L8.74121 13.1133C8.87133 13.2066 8.98913 13.2432 9.09473 13.2432C9.23562 13.2431 9.39849 13.1766 9.58398 12.999C11.0413 11.602 12.4983 10.2047 13.9551 8.80664C14.0171 8.74707 14.0647 8.70265 14.1035 8.65332L14.1445 8.59375C14.3296 8.28569 14.1757 7.88065 13.793 7.77832Z" fill="currentColor" stroke="currentColor" strokeWidth="0.4" />
                                        </g>
                                    </svg>
                                    <span className="text-primary">Once your review has been authorized, it will be visible on the product page.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}