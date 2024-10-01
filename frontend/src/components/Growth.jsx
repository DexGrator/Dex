import React from "react";
import { Card } from "@/components/ui/card";

const Growth = () => {
    return (
        <div className="min-h-[100vh] pt-24 flex justify-center items-center bg-[#021524] text-white">
            <div className="container flex flex-col items-center pb-12">
                {/* Centered Heading */}
                <h1 className="text-2xl font-bold md:text-4xl lg:leading-[1.1] text-center mb-12">
                    Be A Part Of Our Growth
                </h1>

                {/* Text Section */}
                <div className="mt-4 flex flex-col items-start md:flex-row md:items-center md:space-x-8">
                    <div className="md:w-1/3">
                        <h3 className="text-5xl font-semibold">
                            Numbers are <br />
                            Telling Our Story
                        </h3>
                        <h5 className="mt-2 text-sm text-slate-200">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, vitae doloribus aperiam recusandae reprehenderit beatae molestias maiores. Dicta nihil porro maxime eum reiciendis, cum sit, consectetur vero unde reprehenderit facilis.
                        </h5>
                    </div>

                    {/* Right Side - Card Section */}
                    <div className="md:w-2/3 flex flex-col space-y-4 mt-8 md:mt-0">
                        {/* Second Card */}
                        <Card containerClassName="h-[10rem] w-[25rem] bg-transparent flex flex-col items-center justify-center">
                            <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                2M+
                            </h4>
                            <p className="mt-2 text-center text-base text-white">
                                Transactions put till now
                            </p>
                        </Card>

                        {/* Third Card */}
                        <Card containerClassName="h-[10rem] w-[25rem] bg-transparent flex flex-col items-center justify-center">
                            <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                46K+
                            </h4>
                            <p className="mt-2 text-center text-base text-white">
                                Active customer rate
                            </p>
                        </Card>

                        {/* Fourth Card */}
                        <Card containerClassName="h-[10rem] w-[25rem] bg-transparent flex flex-col items-center justify-center">
                            <h4 className="text-center text-base md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                99%
                            </h4>
                            <p className="mt-2 text-center text-base text-white">
                                Up Timing
                            </p>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Growth;
