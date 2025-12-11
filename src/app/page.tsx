
import Footer from "../components/Footer";
import FlashSales from "@/components/FlashSales";
// import Categories from "@/components/Categories";
import BestSelling from "@/components/BestSelling";
import NewArrival from "../components/NewArrival";






export default function Home() {
  return (
   <>
    <NewArrival />
    <FlashSales/>
    {/* <Categories/> */}
    <BestSelling/>
    <Footer />
   </>
  )
}
