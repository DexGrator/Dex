"use client"
import { Button } from "@/app/ui/buttons";
import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="h-[90vh] flex flex-col lg:flex-row items-center justify-center lg:space-x-8">
      {/* Video Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <Image src={"/cat.gif"} height={250} width={250} className="block" />
      </div>

      {/* Text Section */}
      <div className="text-white w-full lg:w-1/2 flex flex-col items-start p-8 lg:p-20">
        <h1 className="text-4xl lg:text-7xl font-bold text-center lg:text-left">
          The Optimal Order Routing Solution
        </h1>
        <p className="text-md lg:text-lg text-left py-4 lg:py-12">
          Smart Order Routing across multiple blockchain protocols, 900+ Liquidity Sources and thousands of token pairs, delivering ultimate savings to users
        </p>
        <Button className="bg-red-200 rounded-xl mt-4 lg:ml-0">Launch dApp</Button>
      </div>
    </div>
  );
};

export default Hero;
