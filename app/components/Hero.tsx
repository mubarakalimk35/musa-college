export default function Hero({ images, current, setShowForm, scrollTo }: any) {
  return (
    <section id="home" className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-gradient-to-br from-blue-50 to-white gap-10">
      <div className="flex-1">
        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">Admission Open 2025-26</span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-5 text-gray-900">Shape Your Future<br /><span className="text-blue-700">with Quality Education</span></h1>
        <p className="mt-4 text-gray-600">Welcome to Govt. General Muhammad Musa Postgraduate College Quetta - Since 1987, providing quality education in Balochistan.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-7 py-3 rounded-lg font-bold">Apply Now</button>
          <button onClick={() => scrollTo('about')} className="bg-white border px-7 py-3 rounded-lg font-bold">Learn More</button>
        </div>
      </div>
      <div className="flex-1 relative w-full h-[400px] overflow-hidden rounded-[20px] shadow-2xl bg-gray-200">
        {images.map((img: string, i: number) => (<img key={i} src={img} alt="" className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`} onError={(e:any)=>{e.target.style.display='none'}} />))}
      </div>
    </section>
  );
}