//src/Pages/Home.jsx
import { Link } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import {
  BookOpen,
  Clock,
  Bell,
  ShieldCheck,
  ArrowRight,
  Search,
} from 'lucide-react'

const LIBRARY_NAME = "Athenaeum"
const TAGLINE = "Where every book finds its reader."

const STATS = [
  { label: "Books Catalogued", value: "10,000+" },
  { label: "Active Members", value: "5,000+" },
  { label: "Genres", value: "50+" },
]

const FEATURES = [
  {
    icon: BookOpen,
    title: "Vast Catalog",
    desc: "Browse thousands of titles across every genre, always up to date.",
  },
  {
    icon: Clock,
    title: "24/7 Access",
    desc: "Reserve, renew, and track your books anytime, from anywhere.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Never miss a due date with automated return alerts.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    desc: "Your data and borrowing history, protected end-to-end.",
  },
]

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      {/* ===== HERO ===== */}
      <div className="relative w-full min-h-screen">
        <Navbar />

        <main
          className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/src/assets/lib3.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>

          {/* Hero content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center font-serif text-orange-100">
            <span className="uppercase tracking-[0.3em] text-xs md:text-sm text-amber-700 mb-4">
              Library Management System
            </span>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
              {LIBRARY_NAME}
            </h1>

            <p className="text-lg md:text-xl text-orange-100/80 font-sans max-w-xl mb-10">
              {TAGLINE}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 font-sans">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/20"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/20"
              >
                <Search size={18} /> Browse Catalog
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16 font-sans">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs md:text-sm text-white/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs font-sans animate-bounce">
            Scroll to explore ↓
          </div>
        </main>
      </div>

      {/* ===== FEATURES ===== */}
      <section className="w-full bg-neutral-950 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Why {LIBRARY_NAME}?</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Everything you need to manage, discover, and enjoy your library — all in one place.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="w-full bg-neutral-950 border-t border-white/10 py-6 px-6 text-center text-white/40 text-xs font-sans">
        © {new Date().getFullYear()} {LIBRARY_NAME}. Built with React, Tailwind & Node.js.
      </footer>
    </div>
  )
}
// import Navbar from '../Components/Navbar'
// // import lib3 from '../assets/lib3.jpg'

// export default function Home() {
//   return (
//     <div className="w-screen min-h-screen flex flex-col">
//       <Navbar />
      
//       {/* Background Section */}
//       <main
//         className="relative w-full h-full flex-grow bg-cover bg-center bg-no-repeat"
//         style={{ backgroundImage: "url('/src/assets/lib3.jpg')" }}
//       >
//         {/* Optional Overlay for better readability */}
//         <div className=" bg-opacity-60 w-full h-full absolute top-0 left-0 z-0"></div>

//         {/* Content on top of overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

//         {/* Heading only */}
//         <div className="relative z-10 px-8 py-10 text-right font-serif text-orange-100">
//           <h2 className="text-4xl font-bold text-center leading-snug">
//             Welcome to the <br />
//             Library Management <br />
//             System
//           </h2>
//         </div>
//       </main>
//     </div>
//   )
// }


