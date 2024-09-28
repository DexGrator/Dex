"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../app/ui/buttons";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../app/ui/sheet";
import SolanaWalletConnect  from "./SolanaWalletConnect.jsx";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { wallet, connect, disconnect, connecting, connected} = useWallet();
  const { setVisible } = useWalletModal();
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  const handleCustomDialogClose = () => setIsCustomDialogOpen(false);


  // Function to handle wallet connection
  const handleWalletButtonClick = () => {
    handleCustomDialogClose();
    setTimeout(() => {
      if (connected) {
        disconnect();
      } else if (!wallet) {
        setVisible(true);
      } else {
        connect();
      }
    }, 300);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrolltoHash = (element_id) => {
    const element = document.getElementById(element_id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };
  

  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">WEB3TASK</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link href="/" className="hover:text-blue-400" onClick={() => scrolltoHash("roadmap")}>Roadmap</Link></li>
            <li><Link href="/docs" className="hover:text-blue-400">Docs</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
          </ul>
        </nav>
        {/* <div className="">
            <SolanaWalletConnect />
          </div> */}
          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen} className="text-white">
        <DialogTrigger asChild>
          <Button variant="outline" className="text-md md:w-36 md:h-12 m-0 text-white">
            Connect
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-[300px] md:h-[400px] text-white lg:h-[400px] w-[90vw] sm:w-[425px] bg-white/10 backdrop-blur-sm flex flex-col justify-center items-center">
          <DialogHeader className="text-center text-white">
            <DialogTitle>Connect Wallet / Login with Gmail</DialogTitle>
          </DialogHeader>
  
          <div className=" mt-4">
            <Button
              onClick={handleWalletButtonClick}
              variant="outline"
              className="w-full md:w-auto md:h-12 flex items-center justify-center"
            >
              <AccountBalanceWalletOutlinedIcon className="text-base mr-1" />
              {connected ? "Disconnect Wallet" : connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
  
          {/* <Separator className="my-4" />
  
          <div className="flex flex-col items-center gap-4 py-4 w-full">
            <div className="flex justify-between w-full items-center">
              <Label htmlFor="email" className="text-right mr-4">
                Email
              </Label>
              <Input id="email" type="email" className="flex-grow w-1/3" />
            </div>
          </div> */}
  
          {/* <DialogFooter className="flex justify-center">
            <Button type="submit" variant="outline" className="h-10 w-28">Login</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
        {/* <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          Swap Now
        </Button> */}
      </div>
    </header>
    // <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    //   <div className="container h-20 relative">
    //     <div className="flex h-full items-center justify-between">
    //       {/* ================== */}
    //       {/* DISPLAY THE LOGO  */}
    //       {/* ================== */}
    //       <Link href="/">
    //         <Image src="/logo.png" width={170} height={100} alt="logo" />
    //       </Link>
    //       {/* ============================ */}
    //       {/* DISPLAY THE MENU FOR DESKTOP */}
    //       {/* ============================ */}
    //       <div className="hidden lg:flex gap-10 text-lg font-semibold text-white">
    //         <Link href="/" className="hover:text-blue-500">Home</Link>
    //         <Link href="/swap" className="hover:text-blue-500">Swap Tokens</Link>
    //         <Link href="/payments" className="hover:text-blue-500">Payments</Link>
    //         <Link href="/" className="hover:text-blue-500">Team</Link>
    //         <Link href="/contact" className="hover:text-blue-500">Contact Us</Link>
    //       </div>
    //       <div className="">
    //         <SolanaWalletConnect />
    //       </div>
    //       {/* =========================== */}
    //       {/* DISPLAY THE MENU FOR MOBILE */}
    //       {/* =========================== */}
    //       <div className="lg:hidden">
    //         <Sheet open={menuOpen} onOpenChange={toggleMenu}>
    //           <SheetTrigger asChild>
    //             <Button size="sm" variant="secondary" onClick={toggleMenu}>
    //               {menuOpen ? <X /> : <Menu />}
    //             </Button>
    //           </SheetTrigger>
    //           <SheetContent>
    //             <div>
    //               <Link href="/">
    //                 <Image src="/logos.svg" width={175} height={100} alt="logo" />
    //               </Link>
    //               <div className="flex mt-10 flex-col gap-6 text-lg font-semibold text-white">
    //                 <Link href="/">
    //                   <Button className="hover:text-blue-500 p-4  border border-transparent rounded-full">Home</Button>
    //                 </Link>
    //                 <Link href="/swap">
    //                   <Button className="hover:text-blue-500 p-4  border border-transparent rounded-full">Swap Token</Button>
    //                 </Link>
    //                 <Link href="/payments">
    //                   <Button className="hover:text-blue-500 p-4  border border-transparent rounded-full">Payments</Button>
    //                 </Link>
    //                 <Link href="/">
    //                   <Button className="hover:text-blue-500 p-4 border border-transparent rounded-full">Team</Button>
    //                 </Link>
    //               </div>
    //             </div>
    //           </SheetContent>
    //         </Sheet>
    //       </div>

    //     </div>
    //   </div>
    // </div>
  );
};

export default Navbar;
