import React from "react";
import { Globe, ArrowRightLeft, Shield, Eye } from 'lucide-react';
import { WobbleCard } from "@/components/ui/wobbleCard";

const WhyUs = () => {
  return (
    <div className="min-h-[100vh] flex justify-center items-center text-white">
      <div className="container flex flex-col items-center pb-12">
        <h1 className="max-w-screen text-2xl font-bold md:text-4xl lg:leading-[1.1] text-center pb-12">
          <span>Why Use </span> 
          <span className="text-[#6100FF]">Our Aggregator?</span> 
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 relative">
          {/* First Card */}
          <div className="lg:col-span-1">
            <WobbleCard containerClassName="h-full bg-transparent  p-4 flex flex-col items-center justify-start">
              <div className="flex justify-center mb-8">
                <Globe className="h-12 w-12 text-blue-500" />
              </div>
              <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Multiswap
              </h4>
              <p className="mt-2 text-center text-base text-white">
                Atomic Multi Swap
              </p>
            </WobbleCard>
          </div>

          {/* Second Card (offset by 50%) */}
          <div className="lg:col-span-1 lg:translate-y-1/2">
            <WobbleCard containerClassName="h-full bg-transparent p-4  flex flex-col items-center justify-start">
              <div className="flex justify-center mb-8">
                <ArrowRightLeft className="h-12 w-12 text-blue-500" />
              </div>
              <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Best Route
              </h4>
              <p className="mt-2 text-center text-base text-white">
                Best Price and <br />
                Route for swapping
              </p>
            </WobbleCard>
          </div>

          {/* Third Card */}
          <div className="lg:col-span-1">
            <WobbleCard containerClassName="h-full bg-transparent p-4  flex flex-col items-center justify-start">
              <div className="flex justify-center mb-8">
                <Shield className="h-12 w-12 text-blue-500" />
              </div>
              <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                MEV Protection
              </h4>
              <p className="mt-2 text-center text-base text-white">
                MEV Secure transaction <br />
                with less fees
              </p>
            </WobbleCard>
          </div>

          {/* Fourth Card (offset by 50%) */}
          <div className="lg:col-span-1 lg:translate-y-1/2">
            <WobbleCard containerClassName="h-full bg-transparent p-4  flex flex-col items-center justify-start">
              <div className="flex justify-center mb-8">
                <Eye className="h-12 w-12 text-blue-500" />
              </div>
              <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Security
              </h4>
              <p className="mt-2 text-center text-base text-white">
                All the transactions <br />
                are distributed over <br />
                the network
              </p>
            </WobbleCard>
          </div>
           {/* Fourth Card (offset by 50%) */}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
