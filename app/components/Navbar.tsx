"use client";
export default function Navbar({ scrollTo, mobileMenu, setMobileMenu, setShowForm }: any) {
  const handleScroll = (id: string) => {
    setMobileMenu(false);
    scrollTo(id);
  };

  const menuItems = ["home","about","news","programs","faculty","downloads","gallery","alumni","contact"];

  return (
    <>
      <nav className="flex justify-between items-center px-4 md:px-10 py-1.5 shadow-md sticky top-0 bg-white z-[60] border-b border-gray-100">
        <div className="flex items-center gap-3 md:gap-4">
          <img src="/logo.png" className="h-14 w-14 md:h-[70px] md:w-[70px] object-contain shrink-0" alt="Logo" onError={(e:any)=>{e.target.style.display='none'}} />
          <div className="leading-tight">
            <h1 className="text-[11px] md:text-[18px] font-black text-[#001f4d] uppercase leading-[0.9] tracking-wide">GOVT. GENERAL MUHAMMAD MUSA</h1>
            <p className="text-[9px] md:text-[13px] font-extrabold text-[#001f4d] uppercase mt-0.5 tracking-wider">POSTGRADUATE COLLEGE QUETTA</p>
          </div>
        </div>
        <div className="hidden lg:flex gap-5 xl:gap-6 items-center font-bold text-[13px] xl:text-[14px] text-gray-800">
          <button onClick={() => scrollTo('home')} className="hover:text-blue-700 transition">Home</button>
          <button onClick={() => scrollTo('about')} className="hover:text-blue-700 transition">About</button>
          <button onClick={() => scrollTo('news')} className="hover:text-blue-700 transition">News</button>
          <button onClick={() => scrollTo('programs')} className="hover:text-blue-700 transition">Programs</button>
          <button onClick={() => scrollTo('faculty')} className="hover:text-blue-700 transition">Faculty</button>
          <button onClick={() => scrollTo('downloads')} className="hover:text-blue-700 transition">Downloads</button>
          <button onClick={() => scrollTo('gallery')} className="hover:text-blue-700 transition">Gallery</button>
          <button onClick={() => scrollTo('alumni')} className="hover:text-blue-700 transition">Alumni</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-blue-700 transition">Contact</button>
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-6 xl:px-7 py-2.5 rounded-xl font-black hover:bg-black active:scale-95 transition">Apply Now</button>
        </div>
        <div className="flex lg:hidden gap-2 items-center">
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-4 py-2 rounded-xl font-black text-[11px] active:scale-95">Apply Now</button>
          <button aria-label="Menu" onClick={() => setMobileMenu(!mobileMenu)} className="text-[22px] font-black w-10 h-10 rounded-xl border-2 bg-white flex items-center justify-center active:scale-95">
            {mobileMenu ? "×" : "☰"}
          </button>
        </div>
      </nav>
      {mobileMenu && (
        <>
          <div onClick={()=>setMobileMenu(false)} className="lg:hidden fixed inset-0 bg-black/40 z-[55] top-[56px] backdrop-blur-[1px]" />
          <div className="lg:hidden bg-white shadow-2xl fixed top-[56px] md:top-[64px] left-0 right-0 z-[56] border-t flex flex-col max-h-[calc(100vh-56px)] overflow-y-auto">
            {menuItems.map((id) => (
              <button key={id} onClick={() => handleScroll(id)} className="text-left px-6 py-4 text-[15px] font-black border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 uppercase tracking-wide">
                {id === 'news' ? 'News & Events' : id}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}