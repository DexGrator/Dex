"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../app/ui/buttons";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../app/ui/sheet";
import SolanaWalletConnect from "./SolanaWalletConnect.js";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-20 relative">
        <div className="flex h-full items-center justify-between">
          {/* ================== */}
          {/* DISPLAY THE LOGO  */}
          {/* ================== */}
          <Link href="/">
            <Image src="/logo.png" width={170} height={100} alt="logo" />
          </Link>
          {/* ============================ */}
          {/* DISPLAY THE MENU FOR DESKTOP */}
          {/* ============================ */}
          <div className="hidden lg:flex gap-10 text-lg font-semibold text-white">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <Link href="/swap" className="hover:text-blue-500">Swap Tokens</Link>
            <Link href="/payments" className="hover:text-blue-500">Payments</Link>
            <Link href="/" className="hover:text-blue-500">Team</Link>
            <Link href="/contact" className="hover:text-blue-500">Contact Us</Link>
          </div>
          <div className="">
            <SolanaWalletConnect />
          </div>
          {/* =========================== */}
          {/* DISPLAY THE MENU FOR MOBILE */}
          {/* =========================== */}
          <div className="lg:hidden">
            <Sheet open={menuOpen} onOpenChange={toggleMenu}>
              <SheetTrigger asChild>
                <Button size="sm" variant="secondary" onClick={toggleMenu}>
                  {menuOpen ? <X /> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div>
                  <Link href="/">
                    <Image src="/logos.svg" width={175} height={100} alt="logo" />
                  </Link>
                  <div className="flex mt-10 flex-col gap-6 text-lg font-semibold text-white">
                    <Link href="/">
                      <Button className="hover:text-blue-500 p-4  border border-transparent rounded-full">Home</Button>
                    </Link>
                    <Link href="/swap">
                      <Button className="hover:text-blue-500 p-4  border border-transparent rounded-full">Swap Token</Button>
                    </Link>
                    <Link href="/payments">
                      <Button className="hover:text-blue-500 p-4  border border-transparent rounded-full">Payments</Button>
                    </Link>
                    <Link href="/">
                      <Button className="hover:text-blue-500 p-4 border border-transparent rounded-full">Team</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
