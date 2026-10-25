export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-20 py-16 bg-gray-50">
      <h2 className="text-3xl font-black text-center text-[#0d2a54]">Contact Us</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="font-black text-lg text-[#0d2a54]">Get in Touch</h3>
          <div className="mt-6 space-y-4 text-sm">
            <p><span className="font-bold">📍 Address:</span> Gulistan Town, Quetta, Balochistan</p>
            <p><span className="font-bold">📞 Phone:</span> 081-2669085</p>
            <p><span className="font-bold">📧 Email:</span> mubarakali.mk.35@gmail.com</p>
          </div>
        </div>
        <div className="bg-white p-2 rounded-xl shadow">
          <iframe src="https://www.google.com/maps?q=Govt+General+Muhammad+Musa+Postgraduate+College+Quetta&z=15&output=embed" width="100%" height="420" style={{border:0}} className="rounded-lg"></iframe>
        </div>
      </div>
    </section>
  );
}