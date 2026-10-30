export const collegeInfo = {
  admission: "✅ Admission 2025-26 Open Hai!\nLast Date: 15 Nov 2025\nEligibility: FSC/ICS with 50%\nDocuments: Matric, FSC, B-Form, Domicile, 4 Photos",
  
  fee: "💰 Fee Structure:\nBS CS / BBA: 20,000/semester\nOther BS (Physics, Chem, Bio, English etc): 15,000/semester",

  programs: "📚 9 BS Programs: Computer Science, Physics, Chemistry, Botany, Zoology, English, Political Science, Economics, BBA (4 Years)",

  timing: "⏰ College Timing: Monday to Friday, 8:30 AM to 2:30 PM",

  location: "📍 Govt. General Muhammad Musa Postgraduate College, Sariab Road, Quetta, Balochistan",

  contact: "📞 Contact: info@gmmmc.edu.pk | Admin Block 1st Floor | WhatsApp: 03400809764",

  eligibility: "📝 Eligibility: FSC/ICS/FA with minimum 50% marks. Age limit koi nahi.",

  hostel: "🏨 Hostel Facility available hai, limited seats hain. Fee 5,000 per month.",

  library: "📖 Library, Computer Labs, Science Labs, Sports Ground, Mosque, Canteen available hai.",

  scholarship: "🎓 Scholarship: Merit & Need-based scholarships available hain. Ehsas / BISP students apply kar sakte hain.",

  principal: "👨‍🏫 Principal: Prof. Manzoor Ahmed Barech - Govt. General Muhammad Musa Postgraduate College Quetta (Est. 1987)",

  apply: "📝 Apply Online: Website pe 'Apply Now' button pe click karein ya /apply page visit karein.",
} as const;

export type IntentKey = keyof typeof collegeInfo;

// Har topic ke liye user kese puch sakta hai - yahan add karte jao
export const intentSynonyms: Record<IntentKey, string[]> = {
  admission: ["admission", "dakhla", "admit", "apply", "form", "last date", "kab se", "open", "admissions", "dakhley"],
  fee: ["fee", "fees", "kitni", "kitna", "price", "paisa", "kharcha", "fess", "structure", "how much", "cost", "charges", "bhatta"],
  programs: ["program", "programs", "course", "courses", "bs", "depart", "subject", "field", "konsy", "kon se", "list", "shobay"],
  timing: ["timing", "time", "open", "close", "kab", "baje", "hours", "kholta", "band", "chutti"],
  location: ["location", "address", "kahan", "kahaan", "jaga", "place", "sariab", "quetta", "kaha hai", "kahan hai"],
  contact: ["contact", "number", "email", "rabta", "phone", "whatsapp", "mail"],
  eligibility: ["eligibility", "marks", "percent", "kitne marks", "eligible", "shart", "criteria", "percentage"],
  hostel: ["hostel", "hostal", "rehna", "room", "accommodation", "hotal"],
  library: ["library", "lab", "facility", "facilities", "canteen", "sports", "ground", "mosque", "sahulat"],
  scholarship: ["scholarship", "stipend", "free", "ehsas", "bisp", "wazifa", "maali"],
  principal: ["principal", "manzoor", "barech", "head", "incharge"],
  apply: ["apply", "online apply", "kesy apply", "kaise apply", "form fill"],
};