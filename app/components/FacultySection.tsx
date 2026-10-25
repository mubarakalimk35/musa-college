"use client";
const facultyData = [
  { id: 1, dept: "Computer Science", icon: "💻", bg: "bg-blue-100", hod: { name: "Prof. Mubarak Ali", pic: "/hod-cs.jpeg" }, teachers: [{ name: "Prof. Mubarak Ali", post: "HOD / Assistant Professor", pic: "/hod-cs.jpeg" }, { name: "Prof. Samiullah", post: "Lecturer", pic: "" }, { name: "Prof. Ahmed Khan", post: "Lecturer", pic: "" }] },
  { id: 2, dept: "Physics Faculty", icon: "⚛️", bg: "bg-orange-100", hod: { name: "Prof. Dr. Nisar Ahmed", pic: "/hod-physics.jpeg" }, teachers: [{ name: "Prof. Dr. Nisar Ahmed", post: "HOD / Professor", pic: "/hod-physics.jpeg" }, { name: "Prof. Khalid Hussain", post: "Associate Professor", pic: "" }] },
  { id: 3, dept: "Mathematics", icon: "📐", bg: "bg-green-100", hod: { name: "Prof. Abdul Qadir", pic: "/hod-math.jpeg" }, teachers: [{ name: "Prof. Abdul Qadir", post: "HOD", pic: "/hod-math.jpeg" }] },
  { id: 4, dept: "Chemistry", icon: "🧪", bg: "bg-purple-100", hod: { name: "Prof. Dr. Fareed", pic: "/hod-chem.jpeg" }, teachers: [{ name: "Prof. Dr. Fareed", post: "HOD", pic: "/hod-chem.jpeg" }] },
  { id: 5, dept: "Zoology", icon: "🦁", bg: "bg-yellow-100", hod: { name: "Prof. Dr. Ayesha", pic: "/hod-zoo.jpeg" }, teachers: [{ name: "Prof. Dr. Ayesha", post: "HOD", pic: "/hod-zoo.jpeg" }] },
  { id: 6, dept: "Economics", icon: "📈", bg: "bg-emerald-100", hod: { name: "Prof. Naseer Ahmed", pic: "/hod-eco.jpeg" }, teachers: [{ name: "Prof. Naseer Ahmed", post: "HOD", pic: "/hod-eco.jpeg" }] },
  { id: 7, dept: "English", icon: "📚", bg: "bg-red-100", hod: { name: "Prof. Tariq Khan", pic: "/hod-eng.jpeg" }, teachers: [{ name: "Prof. Tariq Khan", post: "HOD", pic: "/hod-eng.jpeg" }] },
  { id: 8, dept: "Urdu", icon: "📖", bg: "bg-amber-100", hod: { name: "Prof. Hameed", pic: "/hod-urdu.jpeg" }, teachers: [{ name: "Prof. Hameed", post: "HOD", pic: "/hod-urdu.jpeg" }] },
  { id: 9, dept: "Biology", icon: "🧬", bg: "bg-teal-100", hod: { name: "Prof. Dr. Sajid", pic: "/hod-bio.jpeg" }, teachers: [{ name: "Prof. Dr. Sajid", post: "HOD", pic: "/hod-bio.jpeg" }] },
  { id: 10, dept: "Botany", icon: "🌿", bg: "bg-lime-100", hod: { name: "Prof. Dr. Kalsoom", pic: "/hod-botany.jpeg" }, teachers: [{ name: "Prof. Dr. Kalsoom", post: "HOD", pic: "/hod-botany.jpeg" }] },
  { id: 11, dept: "Microbiology", icon: "🦠", bg: "bg-cyan-100", hod: { name: "Prof. Dr. Ali Raza", pic: "/hod-micro.jpeg" }, teachers: [{ name: "Prof. Dr. Ali Raza", post: "HOD", pic: "/hod-micro.jpeg" }] },
  { id: 12, dept: "Statistics", icon: "📊", bg: "bg-indigo-100", hod: { name: "Prof. Jawad Ahmed", pic: "/hod-stat.jpeg" }, teachers: [{ name: "Prof. Jawad Ahmed", post: "HOD", pic: "/hod-stat.jpeg" }] },
];
const principalData = {
  dept: "College Administration",
  name: "Prof. Manzoor Ahmed Barech",
  pic: "/principal.jpeg",
  post: "Principal - Govt. General Muhammad Musa Postgraduate College Quetta",
  details: [
    { name: "Prof. Manzoor Ahmed Barech", post: "Principal", pic: "/principal.jpeg" },
    { name: "Prof. Vice Principal", post: "Vice Principal", pic: "" },
  ]
};

export default function FacultySection({ setSelectedFaculty }: any) {
  return (
    <section id="faculty" className="px-6 md:px-20 py-16 bg-white">
      <div className="text-center">
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">OUR FACULTY</span>
        <h2 className="text-3xl font-black text-[#0d2a54] mt-3">Departments & Faculty</h2>
        <p className="text-gray-500 mt-2 text-sm">Click on any department to view all teachers</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10 max-w-6xl mx-auto">
        <div onClick={() => setSelectedFaculty({ dept: principalData.dept, teachers: principalData.details, isPrincipal: true })} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl text-center border-2 border-blue-200 hover:shadow-xl transition cursor-pointer">
          <img src={principalData.pic} alt={principalData.name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-700" onError={(e:any)=>{e.target.style.display='none'}} />
          <h3 className="font-bold mt-4 text-[13px] text-[#0d2a54]">{principalData.name}</h3>
          <p className="text-[11px] text-white mt-1 bg-blue-700 px-3 py-1 rounded-full inline-block">Principal</p>
        </div>
        {facultyData.map((fac) => (
          <div key={fac.id} onClick={() => setSelectedFaculty(fac)} className="bg-gray-50 p-6 rounded-xl text-center border hover:shadow-xl transition cursor-pointer">
            {fac.hod.pic ? (<img src={fac.hod.pic} alt={fac.hod.name} className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-200" onError={(e:any)=>{e.target.style.display='none'}} />) : (<div className={`w-24 h-24 rounded-full ${fac.bg} mx-auto flex items-center justify-center text-2xl`}>{fac.icon}</div>)}
            <h3 className="font-bold mt-4 text-[14px] text-[#0d2a54]">{fac.dept}</h3>
            <p className="text-[11px] text-gray-800 mt-1 font-bold">{fac.hod.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}