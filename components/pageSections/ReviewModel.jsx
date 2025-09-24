
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

    // console.log(product);

    const handleSubmit = async () => {
        const isValid = validateForm();
        if (!isValid) {
            // toast.error("Please correct the errors before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                rating: rating,
                user: loginUser,
                review: review,
                product: product?.document_id
                    ? product?.document_id
                    : product?.product?.[0]?.product?.documentId,
                order: product?.order_id ? product?.order_id : product?.documentId,
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
                closeButton: "text-black fill-black `",
            }}
        >
            <ModalContent>
                {() => (
                    <div className="2xl:p-[30px] md:p-7 sm:p-5 p-4">
                        {/* Header */}
                        <ModalHeader className="flex flex-col items-start p-0 2xl:mb-[30px] 1xl:mb-6 md:mb-5 mb-[15px]">
                            <h2 className="2xl:mb-2 mb-1">Add Reviews</h2>
                            <p className="font-normal p2">
                                We would encourage honest review relating to product only.
                            </p>
                        </ModalHeader>

                        {/* Body */}
                        <ModalBody className="p-0 gap-0">
                            {/* Star Rating */}
                            <div className="2xl:mb-[30px] 1xl:mb-[22px] md:mb-[18px] mb-3">
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
                                <div className="2xl:mb-[18px] sm:mb-[10px] mb-1">
                                    <p className="mb-2 font-normal text-black">Write Review</p>
                                    <textarea
                                        className="p2 2xl:h-[280px] 1xl:h-[226px] xl:h-[200px] md:h-[185px] sm:h-[150px] h-[120px] w-full border border-[#D9DDE2] rounded-[5px] sm:py-3 sm:px-5 p-2 font-normal focus:outline-none focus:ring-2 focus:ring-primary"
                                        // rows={10}
                                        placeholder="Write your product review here..."
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                    />
                                    {errors.review && (
                                        <p className="p2 !text-red-500 mt-1">{errors.review}</p>
                                    )}
                                </div>
                                <p className="p2 font-normal">
                                    Once your review has been authorized, it will be visible on
                                    the product page.
                                </p>
                            </div>
                        </ModalBody>

                        {/* Footer */}
                        <div className="sm:mt-6 mt-5">
                            <Button
                                onPress={handleSubmit}
                                color="primary"
                                className="w-fit btn btn-primary"
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                {!isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </div>
                )}
            </ModalContent>
        </Modal>
    );
}