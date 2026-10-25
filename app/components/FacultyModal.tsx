export default function FacultyModal({ selectedFaculty, setSelectedFaculty }: any) {
  if (!selectedFaculty) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-0 md:p-3" onClick={() => setSelectedFaculty(null)}>
      <div className="bg-white md:rounded-2xl w-full h-full md:h-[96vh] max-w-[98%] md:max-w-[95%] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 md:p-6 border-b bg-[#0d2a54] text-white shrink-0">
          <h2 className="text-lg md:text-2xl font-black">{selectedFaculty.dept}</h2>
          <button onClick={() => setSelectedFaculty(null)} className="w-10 h-10 bg-white/20 rounded-full font-bold text-xl">×</button>
        </div>
        <div className="p-3 md:p-8 overflow-y-auto flex-1 bg-[#f8fafc]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedFaculty.teachers.map((t: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-700">{t.name.charAt(0)}</div>
                <h4 className="font-bold text-[12px] mt-2">{t.name}</h4>
                <p className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mt-1">{t.post}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-white flex justify-end"><button onClick={() => setSelectedFaculty(null)} className="bg-[#0d2a54] text-white px-10 py-2.5 rounded-xl font-bold">Close</button></div>
      </div>
    </div>
  );
}