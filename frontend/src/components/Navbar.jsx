"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../app/ui/buttons";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../app/ui/sheet";

const NavLink = ({ href, onClick, children }) => (
  <Link href={href}>
    <p onClick={onClick}>{children}</p>
  </Link>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-white">
      <div className="container h-20 relative">
        <div className="flex h-full items-center justify-between">
          {/* ================== */}
          {/* DISPLAY THE LOGO  */}
          {/* ================== */}
          <Link href="/">
            <Image
              src={"/image.png"}
              width={170}
              height={100}
              alt="logo"
              className="bg-[#021524]"
            />
          </Link>
          {/* ============================ */}
          {/* DISPLAY THE MENU AND BUTTON ON THE RIGHT */}
          {/* ============================ */}
          <div className="flex items-center gap-10">
            {/* Display menu links on large screens */}
            <div className="hidden lg:flex gap-10 text-lg font-semibold">
              <NavLink href="/">About</NavLink>
              <NavLink href="/">Blog</NavLink>
              <NavLink href="/">Contact</NavLink>
            </div>

            {/* Display Launch dApp button on large screens */}
            <Button className="bg-red-200 rounded-xl hidden lg:block text-black font-bold">
              Launch dApp
            </Button>

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
                      <Image
                        src="/image.png"
                        width={175}
                        height={100}
                        alt="logo"
                      />
                    </Link>
                    <div className="flex mt-10 flex-col gap-6 text-lg font-semibold text-white">
                      <NavLink href="/">About</NavLink>
                      <NavLink href="/">Blog</NavLink>
                      <NavLink href="/">Contact</NavLink>
                    </div>
                    <Link href={"/app"} className="mt-10 flex gap-6">
                      <Button className="bg-red-200 rounded-xl text-black font-bold">
                        Launch dApp
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
