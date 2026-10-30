import Image from "next/image";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* About Section */}
      <section className="pt-28 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
            <div className="w-20 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full h-[400px] rounded-lg shadow-lg overflow-hidden">
              <Image 
                src="/foundation.jpeg" 
                alt="Govt. General Muhammad Musa Postgraduate College Quetta" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p><strong>Govt. General Muhammad Musa Postgraduate College Quetta</strong> is committed to providing quality education and fostering academic excellence.</p>
              <p>Established with a vision to empower students, we offer a wide range of programs in Science and Arts, supported by experienced faculty and modern facilities.</p>
              <p>We believe in holistic development - academic, moral, and social - to prepare our students for the challenges of the modern world.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}