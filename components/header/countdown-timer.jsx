"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer() {
  const [time, setTime] = useState({
    hours: 4,
    minutes: 52,
    seconds: 22,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds - 1

        if (newSeconds >= 0) {
          return { ...prevTime, seconds: newSeconds }
        }

        const newMinutes = prevTime.minutes - 1

        if (newMinutes >= 0) {
          return { ...prevTime, minutes: newMinutes, seconds: 59 }
        }

        const newHours = prevTime.hours - 1

        if (newHours >= 0) {
          return { hours: newHours, minutes: 59, seconds: 59 }
        }

        clearInterval(timer)
        return { hours: 0, minutes: 0, seconds: 0 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <span className="p2 !text-white text-base">
        {String(time.hours).padStart(2, "0")}:{String(time.minutes).padStart(2, "0")}:
        {String(time.seconds).padStart(2, "0")}
      </span>
      <span className="ml-2 2xl:text-base text-[15px]">
        Exclusive 10% OFF! Up to $10 Hurry Before Time Runs Out! Use Code:
        <span className="font-bold text-orange-100 border-b border-orange-100 text-base ml-0.5">WEBBY10</span>
      </span>
    </>
  )
}

