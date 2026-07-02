import AboutUs from "@/components/BlockAbout";
import { BureauGrid } from "@/components/dashboard/Bureau/BureauGrid";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import HeroSection from "@/components/HeroSection";


export default function Home() {
  return (
    <>
    <HeroSection/>
    <Gallery/>
    <AboutUs/>
    <BureauGrid/>
    <FAQs/>
    <Footer/>
    </>
  )
}
