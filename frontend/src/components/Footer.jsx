"use client";

import Link from 'next/link';
import { FaTwitter, FaDiscord } from 'react-icons/fa';  
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="text-white py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logodex.png" width={200} height={50} alt="Logo" className="w-auto h-12" />
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Join our Discord channel or follow us on Twitter to keep up to date with our latest work and announcements.
            </p>
            <div className="flex space-x-4">
              <Link href="https://x.com/DexGrator" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaDiscord size={24} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="#roadmap" className="text-gray-400 hover:text-white transition-colors scroll-smooth">Roadmap</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link ></li>
{/*               <li><Link href="/web3dev" className="text-gray-400 hover:text-white transition-colors">Web3Dev</Link></li> */}
              {/* <li><Link href="/linktree" className="text-gray-400 hover:text-white transition-colors">LinkTree</Link></li> */}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">&copy; 2024 Dexgrator. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
