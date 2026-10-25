"use client";
const alumni = [
  { name: "Dr. Abdul Qadir", batch: "1995", role: "Professor, BUITEMS", img: "https://i.pravatar.cc/150?img=11", quote: "This college made me what I am today." },
  { name: "Engr. Sana Ullah", batch: "2002", role: "Engineer, WAPDA", img: "https://i.pravatar.cc/150?img=32", quote: "Best faculty and environment for learning." },
  { name: "Ms. Fatima Khan", batch: "2010", role: "CSS Officer", img: "https://i.pravatar.cc/150?img=5", quote: "Proud to be a part of GM Musa College." },
  { name: "Dr. Nisar Ahmed", batch: "1998", role: "Doctor, CMH Quetta", img: "https://i.pravatar.cc/150?img=15", quote: "Foundation of my career started here." },
];
export default function Alumni() {
  return (
    <section id="alumni" className="px-6 md:px-20 py-16 bg-[#0d2a54] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10"><span className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold">OUR PRIDE</span><h2 className="text-3xl font-black mt-3">Our Alumni</h2><p className="text-blue-200 text-sm mt-2">Successful graduates serving the nation</p></div>
        <div className="grid md:grid-cols-4 gap-6">
          {alumni.map((a,i) => (
            <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition">
              <img src={a.img} className="w-20 h-20 rounded-full mx-auto border-4 border-white/20 object-cover" />
              <h4 className="font-black text-[14px] mt-4">{a.name}</h4>
              <p className="text-[11px] text-blue-200">Batch {a.batch} • {a.role}</p>
              <p className="text-[11px] text-white/70 mt-3 italic">"{a.quote}"</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center"><button className="bg-white text-[#0d2a54] px-6 py-2.5 rounded-full font-black text-[13px]">Join Alumni Network →</button></div>
      </div>
    </section>
  );
}