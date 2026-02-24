import "./App.css";
import Team from "@/components/team";
import AboutUs from "@/components/BlockAbout";
import Gallery from "@/components/Gallery";
import FAQs from "@/components/FAQs";
import HeroSection from "@/components/HeroSection";
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
