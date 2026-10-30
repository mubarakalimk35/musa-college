"use client";
import Image from "next/image";

const principalData = {
  name: "Prof. Manzoor Ahmed Barech",
  pic: "/principal.jpeg",
  post: "Principal",
  college: "Govt. General Muhammad Musa Postgraduate College Quetta",
  message: "Welcome to Govt. General Muhammad Musa Postgraduate College Quetta, one of the most prestigious institutions of Balochistan established in 1987. Our mission is to provide quality education, character building and to prepare our students for the challenges of modern world. We have highly qualified faculty, well-equipped laboratories, central library and a peaceful learning environment. I am proud of our students who have excelled in various fields including CSS, PMS, Medical, Engineering and IT."
};

export default function PrincipalMessage() {
  return (
    <section className="px-4 md:px-20 py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[11px] font-black tracking-wide">PRINCIPAL'S MESSAGE</span>
          <h2 className="text-[24px] md:text-3xl font-black text-[#0d2a54] mt-3">Message From Principal</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center bg-gradient-to-br from-blue-50 to-white p-5 md:p-10 rounded-[20px] border-2 border-blue-50 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-blue-700 shadow-xl relative shrink-0">
              <Image 
                src={principalData.pic} 
                alt={principalData.name} 
                fill
                sizes="(max-width:768px) 160px, 208px"
                className="object-cover" 
                priority
              />
            </div>
            <h3 className="font-black text-[15px] md:text-[16px] mt-4 md:mt-5 text-[#0d2a54] text-center leading-tight">{principalData.name}</h3>
            <p className="text-[10px] md:text-[11px] text-white bg-blue-700 px-4 py-1 rounded-full mt-2 font-black">{principalData.post}</p>
            <p className="text-[10px] text-gray-500 mt-2 text-center px-2 leading-tight">{principalData.college}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-700 text-[13px] md:text-[14px] leading-relaxed">
              Assalam-o-Alaikum! It is my great pleasure to welcome you to <b className="text-[#0d2a54]">{principalData.college}</b>, one of the most prestigious institutions of Balochistan established in 1987.
              <br/><br/>
              {principalData.message}
              <br/><br/>
              I invite you to be part of this great institution and shape your bright future with us.
              <br/><br/>
              <b className="text-[#0d2a54]">May Allah bless you all.</b>
            </p>
            <div className="mt-6 pt-4 border-t border-blue-100">
              <p className="font-black text-[14px] text-[#0d2a54]">— {principalData.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{principalData.post}, {principalData.college}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}