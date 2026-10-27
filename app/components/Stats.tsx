"use client";
import { useEffect, useState, useRef } from "react";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.6 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <h2 ref={ref} className="text-2xl font-black">
      {count}{suffix}
    </h2>
  );
}

export default function Stats() {
  return (
    <section className="bg-[#0d2a54] text-white py-4 px-6 md:px-20 grid grid-cols-4 gap-4 text-center">
      <div><CountUp end={2000} suffix="+" /><p className="text-blue-200 text-sm">Students</p></div>
      <div><CountUp end={50} suffix="+" /><p className="text-blue-200 text-sm">Faculty</p></div>
      <div><CountUp end={9} suffix="" /><p className="text-blue-200 text-sm">Programs</p></div>
      <div><CountUp end={1987} suffix="" /><p className="text-blue-200 text-sm">Established</p></div>
    </section>
  );
}