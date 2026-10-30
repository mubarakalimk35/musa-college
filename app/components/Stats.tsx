"use client";
import { useEffect, useState, useRef } from "react";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1600;
          const steps = duration / 16;
          const increment = end / steps;
          
          timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              if (timer) clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 } // 0.6 se 0.3 - mobile pe jaldi trigger
    );
    
    observer.observe(el);
    
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [end]);

  return (
    <h2 ref={ref} className="text-[20px] md:text-2xl font-black leading-none">
      {count}{suffix}
    </h2>
  );
}

const defaultStats = [
  { id: 1, label: "Students", value: "2000+" },
  { id: 2, label: "Faculty", value: "50+" },
  { id: 3, label: "Programs", value: "9" },
  { id: 4, label: "Established", value: "1987" },
];

export default function Stats({ stats: propStats }: { stats?: any[] }) {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    // ✅ Agar parent ne prop bhej diya to fetch skip - Hero ki tarah
    if (propStats && propStats.length === 4) {
      setStats(propStats);
      return;
    }

    const fetchData = () => {
      fetch(`/api/home`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data?.stats) && data.stats.length === 4) {
            setStats(data.stats);
          }
        })
        .catch(() => {});
    };
    fetchData();
    // ❌ Interval hata diya - no polling, battery safe
  }, [propStats]);

  const parseValue = (val: string) => {
    const str = String(val || "0");
    const num = parseInt(str.replace(/[^0-9]/g, "")) || 0;
    const suffix = str.replace(/[0-9]/g, "").slice(0, 5);
    return { num, suffix };
  };

  return (
    <section className="bg-[#0d2a54] text-white py-5 md:py-4 px-4 md:px-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 text-center">
      {stats.map((item) => {
        const { num, suffix } = parseValue(item.value);
        return (
          <div key={String(item.id)} className="py-1">
            <CountUp end={num} suffix={suffix} />
            <p className="text-blue-200 text-[11px] md:text-sm font-bold mt-1 tracking-wide uppercase md:normal-case">{item.label}</p>
          </div>
        );
      })}
    </section>
  );
}