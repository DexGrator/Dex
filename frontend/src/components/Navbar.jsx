"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../app/ui/buttons";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../app/ui/sheet";
import SolanaWalletConnect from "./SolanaWalletConnect.jsx";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import Image from "next/image";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { wallet, connect, disconnect, connecting, connected } = useWallet();
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

  const scrolltoHash = (element_id) => {
    const element = document.getElementById(element_id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          {/* <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            WEB3TASK
          </span> */}
          <Image src={"/logodex.png"} width={200} height={1000} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/" className="hover:text-blue-400" onClick={() => scrolltoHash("roadmap")}>Roadmap</Link>
          <Link href="/swap" className="hover:text-blue-400">Swap</Link>
          {/* <Link href="/" className="hover:text-blue-400">Docs</Link>
          <Link href="/" className="hover:text-blue-400">Contact</Link> */}
        </nav>

        {/* Wallet Connection Button */}
        <div className="hidden lg:block">
          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen} className="text-white">
            <DialogTrigger asChild>
              <Button variant="outline" className="text-md md:w-36 md:h-12 m-0 text-white">
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] h-[300px] md:h-[400px] text-white lg:h-[400px] w-[90vw] sm:w-[425px] bg-white/10 backdrop-blur-sm flex flex-col justify-center items-center">
              <DialogHeader className="text-center text-white">
                <DialogTitle>Connect Wallet</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Button
                  onClick={handleWalletButtonClick}
                  variant="outline"
                  className="w-full md:w-auto md:h-12 flex items-center justify-center"
                >
                  <AccountBalanceWalletOutlinedIcon className="text-base mr-1" />
                  {connected ? "Disconnect Wallet" : connecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <Sheet open={menuOpen} onOpenChange={toggleMenu}>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" onClick={toggleMenu}>
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col items-center mt-10 gap-6 text-lg font-semibold text-white">
                <Link href="/" className="hover:text-blue-500">Home</Link>
                <Link href="/" className="hover:text-blue-500" onClick={() => scrolltoHash("roadmap")}>Roadmap</Link>
                {/* <Link href="/docs" className="hover:text-blue-500">Docs</Link>
                <Link href="/contact" className="hover:text-blue-500">Contact</Link> */}
                <Link href="/swap" className="hover:text-blue-500">Swap</Link>
              </div>
              <div className="lg:hidden text-white text-center mt-4">
                <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen} className="text-white">
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-md w-full">
                      Connect
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] h-[300px] md:h-[400px] text-white lg:h-[400px] w-[90vw] sm:w-[425px] bg-white/10 backdrop-blur-sm flex flex-col justify-center items-center">
                    <DialogHeader className="text-center text-white">
                      <DialogTitle>Connect Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <Button
                        onClick={handleWalletButtonClick}
                        variant="outline"
                        className="w-full md:w-auto md:h-12 flex items-center justify-center"
                      >
                        <AccountBalanceWalletOutlinedIcon className="text-base mr-1" />
                        {connected ? "Disconnect Wallet" : connecting ? "Connecting..." : "Connect Wallet"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Connect Wallet Button in Mobile View */}
    </header>
  );
};

export default Navbar;
