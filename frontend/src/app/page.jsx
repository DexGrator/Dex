import Hero from "../components/Hero";
import Header from "@/components/Navbar";
import React from "react";
import Features from "@/components/Features";
import Roadmap from "@/components/Roadmap";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Page = () => {
  console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY)
  return (
    <div className="bg-[#021524]">
      <Header />
      <Hero />
      <Features/>
      <Roadmap/>
      <Footer/>
    </div>
  );
};

export default Page;
