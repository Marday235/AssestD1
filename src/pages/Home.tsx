import AboutUs from "@/components/BlockAbout";

import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import GaleriePage from "./GaleriePage";
import { BureauGridPage } from "./BureauGridPage";



export default function Home() {
  return (
    <>
    <HeroSection/>
    <AboutUs/>
    <GaleriePage/>
    <BureauGridPage/>
    <FAQs/>
    <Footer/>
    </>
  )
}
