export default function Programs() {
  return (
    <section id="programs" className="px-4 md:px-20 py-12 md:py-16 bg-gray-50">
      <h2 className="text-[24px] md:text-3xl font-black text-center text-[#0d2a54]">Our Programs</h2>
      <p className="text-center text-gray-500 mt-2 text-[13px] md:text-sm max-w-xl mx-auto px-2">Quality education for intermediate and undergraduate levels</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-10 max-w-4xl mx-auto">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-gray-100 border-t-4 border-t-blue-700 hover:border-t-blue-700 hover:shadow-md transition active:scale-[0.98]">
          <h3 className="font-black text-[18px] md:text-xl text-blue-700">Intermediate</h3>
          <p className="text-gray-600 mt-3 text-[13px] md:text-sm leading-relaxed">FSc Pre-Medical, Pre-Engineering, FA, ICS with experienced faculty and modern labs.</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-gray-100 border-t-4 border-t-green-600 hover:border-t-green-600 hover:shadow-md transition active:scale-[0.98]">
          <h3 className="font-black text-[18px] md:text-xl text-green-700">BS Programs</h3>
          <p className="text-gray-600 mt-3 text-[13px] md:text-sm leading-relaxed">BS Computer Science, English, Physics, Maths, Zoology, Economics, Microbiology, Botany and more.</p>
        </div>
      </div>
    </section>
  );
}