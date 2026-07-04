import AboutUs from "@/components/BlockAbout";
import { BureauGrid } from "@/components/dashboard/Bureau/BureauGrid";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import GaleriePage from "./GaleriePage";


export default function Home() {
  return (
    <>
    <HeroSection/>
    <AboutUs/>
    <GaleriePage/>
    <BureauGrid/>
    <FAQs/>
    <Footer/>
    </>
  )
}
