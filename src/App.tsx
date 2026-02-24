import "./App.css";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero";
import Team from "@/components/Team.jsx";
import AboutUs from "@/components/BlockAbout.jsx";
import Gallery from "@/components/Gallery.jsx";
import FAQs from "@/components/FAQs.jsx";
import HeroSection from "@/components/HeroSection.jsx";
function App() {
  return (
    <div>
      {/* <HeroColor/> */}
      {/* <Navbar />
      <Hero /> */}
      <HeroSection /> 
      <AboutUs />
      <Gallery />
      <Team />
      <FAQs />
    </div>
  );
}

export default App;
