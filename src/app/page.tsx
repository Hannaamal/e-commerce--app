
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeComponent from "../components/NewArrival";
import FlashSales from "@/components/FlashSales";
import Categories from "@/components/Categories";
import BestSelling from "@/components/BestSelling";
import NewArrival from "../components/NewArrival";






export default function Home() {
  return (
   <>
   
    <Navbar />
    <NewArrival />
    <FlashSales/>
    <Categories/>
    <BestSelling/>
    <Footer />
   </>
  )
}
