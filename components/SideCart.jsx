"use client"

import { useCart } from "@/contexts/CartContext"


export default function SideCart() {
    const { isCartOpen, closeCart, cartItems, subtotal } = useCart()

    return (
        <>
            {isCartOpen && <div className="fixed inset-0 bg-black/50 z-40 !m-0" onClick={closeCart} />}

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-4 bg-blue-300">
                    <h5 className="sm:text-[20px] text-lg font-medium">Cart ({cartItems.length})</h5>
                    <button onClick={closeCart}>
                        <div className="h-4 w-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                className="cursor-pointer"
                            >
                                <path
                                    d="M17 5L5 17M5 5L17 17"
                                    stroke="black"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        </div>
                    </button>
                </div>

                <div className="overflow-y-auto sm:max-h-[calc(100vh-235px)] max-h-[calc(100vh-210px)] sm:p-5 p-3 space-y-[25px] h-full">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start sm:gap-[18px] gap-3">
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="2xl:w-[130px] 2xl:h-[92px] lg:w-[125px] lg:h-[88px] sm:w-[118px] sm:h-[83px] w-20 h-[75px] rounded-[3px]"
                            />
                            <div className="flex-1">
                                <p className="p2 !text-black !font-medium mb-3">{item.title}</p>
                                <p className="p2 !text-primary !font-medium">${item.price.toFixed(2)}</p>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 sm:ml-[10px] mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path
                                        d="M12.2543 6.9916C12.3264 6.92443 12.3845 6.84372 12.4253 6.75409C12.4662 6.66447 12.489 6.56767 12.4925 6.46922C12.4959 6.37078 12.4799 6.27263 12.4454 6.18036C12.411 6.08809 12.3586 6.00352 12.2915 5.93147C12.2243 5.85943 12.1436 5.80132 12.054 5.76046C11.9643 5.7196 11.8675 5.6968 11.7691 5.69335C11.6706 5.6899 11.5725 5.70588 11.4802 5.74037C11.388 5.77485 11.3034 5.82718 11.2313 5.89435L9.03684 7.94035L6.99084 5.7451C6.85394 5.60488 6.66759 5.52382 6.47168 5.51925C6.27577 5.51468 6.08585 5.58697 5.94256 5.72065C5.79928 5.85433 5.714 6.03879 5.70499 6.23455C5.69598 6.4303 5.76394 6.62181 5.89434 6.7681L7.94034 8.9626L5.74509 11.0086C5.67049 11.0751 5.60994 11.1558 5.56698 11.246C5.52403 11.3363 5.49953 11.4341 5.49493 11.534C5.49034 11.6338 5.50573 11.7335 5.54022 11.8273C5.57471 11.9211 5.62758 12.007 5.69575 12.0801C5.76391 12.1532 5.84599 12.2119 5.93716 12.2528C6.02833 12.2937 6.12676 12.3159 6.22666 12.3183C6.32655 12.3206 6.42591 12.3029 6.51888 12.2663C6.61186 12.2297 6.69659 12.1749 6.76809 12.1051L8.96259 10.0598L11.0086 12.2543C11.0746 12.3303 11.1553 12.3922 11.2458 12.4363C11.3363 12.4805 11.4348 12.5059 11.5353 12.5112C11.6358 12.5164 11.7364 12.5014 11.831 12.467C11.9256 12.4326 12.0123 12.3794 12.086 12.3108C12.1596 12.2421 12.2187 12.1594 12.2596 12.0674C12.3006 11.9754 12.3226 11.8762 12.3244 11.7755C12.3262 11.6748 12.3077 11.5748 12.27 11.4815C12.2323 11.3881 12.1762 11.3033 12.1051 11.2321L10.0598 9.0376L12.2543 6.9916Z"
                                        fill="#808080"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0.75 9C0.75 4.44375 4.44375 0.75 9 0.75C13.5562 0.75 17.25 4.44375 17.25 9C17.25 13.5562 13.5562 17.25 9 17.25C4.44375 17.25 0.75 13.5562 0.75 9ZM9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 8.11358 2.42459 7.23583 2.76381 6.41689C3.10303 5.59794 3.60023 4.85382 4.22703 4.22703C4.85382 3.60023 5.59794 3.10303 6.41689 2.76381C7.23583 2.42459 8.11358 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75Z"
                                        fill="#808080"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="sm:py-[18px] sm:px-5 p-3 shadow-gray">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-black">Subtotal:</p>
                        <p className="text-primary font-medium">${subtotal.toFixed(2)}</p>
                    </div>
                    <button className="w-full btn btn-outline-primary transition mb-3">View Cart</button>
                    <button className="w-full btn btn-primary transition">Checkout</button>
                </div>
            </div>
        </>
    )
}
