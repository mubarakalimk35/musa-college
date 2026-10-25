export default function Programs() {
  return (
    <section id="programs" className="px-6 md:px-20 py-16 bg-gray-50">
      <h2 className="text-3xl font-black text-center text-[#0d2a54]">Our Programs</h2>
      <p className="text-center text-gray-500 mt-2 text-sm">Quality education for intermediate and undergraduate levels</p>
      <div className="grid md:grid-cols-2 gap-8 mt-10 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow border-t-4 border-blue-700"><h3 className="font-bold text-xl text-blue-700">Intermediate</h3><p className="text-gray-600 mt-3 text-sm">FSc Pre-Medical, Pre-Engineering, FA, ICS with experienced faculty and modern labs.</p></div>
        <div className="bg-white p-8 rounded-xl shadow border-t-4 border-green-600"><h3 className="font-bold text-xl text-green-700">BS Programs</h3><p className="text-gray-600 mt-3 text-sm">BS Computer Science, English, Physics, Maths, Zoology, Economics, Microbiology, Botany and more.</p></div>
      </div>
    </section>
  );
}