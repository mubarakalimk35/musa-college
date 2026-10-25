"use client";
export default function Navbar({ scrollTo, mobileMenu, setMobileMenu, setShowForm }: any) {
  return (
    <>
      <nav className="flex justify-between items-center px-4 md:px-10 py-1.5 shadow-md sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" className="h-20 w-20 md:h-[85px] md:w-[85px] object-contain" alt="Logo" onError={(e:any)=>{e.target.style.display='none'}} />
          <div className="leading-tight text-justify">
            <h1 className="text-[16px] md:text-[22px] font-black text-[#001f4d] uppercase leading-[0.9] tracking-wide">GOVT. GENERAL MUHAMMAD MUSA</h1>
            <p className="text-[12px] md:text-[15px] font-extrabold text-[#001f4d] uppercase mt-1 tracking-wider">POSTGRADUATE COLLEGE QUETTA</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 items-center font-bold text-[14px] text-gray-800">
          <button onClick={() => scrollTo('home')} className="hover:text-blue-700">Home</button>
          <button onClick={() => scrollTo('about')} className="hover:text-blue-700">About</button>
          <button onClick={() => scrollTo('news')} className="hover:text-blue-700">News & Events</button>
          <button onClick={() => scrollTo('programs')} className="hover:text-blue-700">Programs</button>
          <button onClick={() => scrollTo('faculty')} className="hover:text-blue-700">Faculty</button>
          <button onClick={() => scrollTo('downloads')} className="hover:text-blue-700">Downloads</button>
          <button onClick={() => scrollTo('gallery')} className="hover:text-blue-700">Gallery</button>
          <button onClick={() => scrollTo('alumni')} className="hover:text-blue-700">Alumni</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-blue-700">Contact</button>
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-7 py-2.5 rounded-lg">Apply Now</button>
        </div>
        <div className="flex md:hidden gap-2 items-center">
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-[12px]">Apply Now</button>
          <div onClick={() => setMobileMenu(!mobileMenu)} className="text-2xl font-bold px-3 py-1 rounded-lg border bg-white mobile-black">☰</div>
        </div>
      </nav>
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-2xl fixed top-[64px] left-0 right-0 z-[45] border-t flex flex-col">
          <p onClick={() => scrollTo('home')} className="mobile-black" style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>Home</p>
          <p onClick={() => scrollTo('about')} className="mobile-black" style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>About</p>
          <p onClick={() => scrollTo('news')} className="mobile-black" style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>News & Events</p>
          <p onClick={() => scrollTo('programs')} className="mobile-black" style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>Programs</p>
          <p onClick={() => scrollTo('faculty')} className="mobile-black" style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>Faculty</p>
          <p onClick={() => scrollTo('downloads')} style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>Downloads</p>
          <p onClick={() => scrollTo('gallery')} style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>Gallery</p>
          <p onClick={() => scrollTo('alumni')} style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, borderBottom:'1px solid #e5e7eb', background:'#fff'}}>Alumni</p>
          <p onClick={() => scrollTo('contact')} className="mobile-black" style={{margin:0, padding:'18px 24px', color:'#000', fontSize:'18px', fontWeight:900, background:'#fff'}}>Contact</p>
        </div>
      )}
    </>
  );
}