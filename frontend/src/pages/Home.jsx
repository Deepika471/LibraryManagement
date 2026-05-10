//src/Pages/Home.jsx
import Navbar from '../Components/Navbar'
// import lib3 from '../assets/lib3.jpg'

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col">
      <Navbar />
      
      {/* Background Section */}
      <main
        className="relative w-full h-full flex-grow bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/lib3.jpg')" }}
      >
        {/* Optional Overlay for better readability */}
        <div className=" bg-opacity-60 w-full h-full absolute top-0 left-0 z-0"></div>

        {/* Content on top of overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        {/* Heading only */}
        <div className="relative z-10 px-8 py-10 text-right font-serif text-orange-100">
          <h2 className="text-4xl font-bold text-center leading-snug">
            Welcome to the <br />
            Library Management <br />
            System
          </h2>
        </div>
      </main>
    </div>
  )
}


