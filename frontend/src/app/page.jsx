import Hero from "../components/Hero";
import Header from "@/components/Navbar";
import React from "react";
import Features from "@/components/Features";
import Roadmap from "@/components/Roadmap";
import WhyUs from "@/components/WhyUs"
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Growth from "@/components/Growth";
import ImageRoller from "@/components/ImageRoller";
import Integration from "@/components/integration";
const Page = () => {
  console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY)
  return (
    <div className="bg-[#021524]">
      <Header />
      <Hero />
      <ImageRoller/>
      <WhyUs />
      <Growth />
      {/* <Features/> */}
      <Roadmap/>
      <Integration/>
      <Footer/>
    </div>
  );
};

export default Page;
