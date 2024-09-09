"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../app/ui/buttons";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../app/ui/sheet";
import ConnectWalletButton from "./CnnectWalletButton";

const NavLink = ({ href, onClick, children }) => (
  <Link href={href}>
    <p onClick={onClick}>{children}</p>
  </Link>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-20 relative">
        <div className="flex h-full items-center justify-between">
          {/* ================== */}
          {/* DISPLAY THE LOGO  */}
          {/* ================== */}
          <Link href="/">
            <Image src="/logos.png" width={170} height={100} alt="logo" />
          </Link>
          {/* ============================ */}
          {/* DISPLAY THE MENU FOR DESKTOP */}
          {/* ============================ */}
          <div className="hidden lg:flex gap-10 text-lg font-semibold">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/">Swap Tokens</NavLink>
            <NavLink href="/">Team</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </div>
          <div className="hidden lg:flex gap-6 rounded-full bg-blue-200 px-4 py-2 hover:bg-blue-400 font-bold">
            <ConnectWalletButton />
          </div>
          {/* =========================== */}
          {/* DISPLAY THE MENU FOR MOBILE */}
          {/* =========================== */}
          <div className="lg:hidden">
            <Sheet open={menuOpen} onOpenChange={toggleMenu}>
              <SheetTrigger asChild>
                <Button size="sm" variant="secondary" onClick={toggleMenu}>
                  {menuOpen ? <></> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div>
                  <Link href="/">
                    <Image src="/logos.svg" width={175} height={100} alt="logo" />
                  </Link>
                  <div className="flex mt-10 flex-col gap-6 text-lg font-semibold">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/">Swap Token</NavLink>
                    <NavLink href="/">Team</NavLink>
                  </div>
                  <div className="mt-10 flex gap-6">
                    <ConnectWalletButton />
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

export default Header;
