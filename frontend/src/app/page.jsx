import Hero from "../components/Hero";
import Header from "@/components/Navbar";
import React from "react";
const Page = () => {
  console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY)
  return (
    <div className="bg-[#021524]">
      <Header />
      <Hero />
    </div>
  );
};

export default Page;
