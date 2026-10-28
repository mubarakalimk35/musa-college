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

// ye default hai, agar API fail ho to yahi dikhega
const defaultStats = [
  { id: 1, label: "Students", value: "2000+" },
  { id: 2, label: "Faculty", value: "50+" },
  { id: 3, label: "Programs", value: "9" },
  { id: 4, label: "Established", value: "1987" },
];

export default function Stats() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/home?t=${Date.now()}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data?.stats?.length) setStats(data.stats);
        })
        .catch(() => {});
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const parseValue = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, "")) || 0;
    const suffix = val.replace(/[0-9]/g, "");
    return { num, suffix };
  };

  return (
    <section className="bg-[#0d2a54] text-white py-4 px-6 md:px-20 grid grid-cols-4 gap-4 text-center">
      {stats.map((item) => {
        const { num, suffix } = parseValue(item.value);
        return (
          <div key={item.id}>
            <CountUp end={num} suffix={suffix} />
            <p className="text-blue-200 text-sm">{item.label}</p>
          </div>
        );
      })}
    </section>
  );
}