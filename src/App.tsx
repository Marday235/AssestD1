import "./App.css";
import Team from "@/components/team";
import AboutUs from "@/components/BlockAbout";
import Gallery from "@/components/Gallery";
import FAQs from "@/components/FAQs";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

import { ThemeProvider } from "next-themes";
function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {/* ton application */}
      {/* <HeroColor/> */}
      {/* <Navbar />
      <Hero /> */}
      <HeroSection />
      <AboutUs />
      <Gallery />
      <Team />
      {/* <Gallery6 /> */}
      <FAQs />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
