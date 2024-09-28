"use client";

import Link from 'next/link';
import { FaTwitter, FaDiscord } from 'react-icons/fa';  

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              WEB3TASK
            </Link>
            <p className="mt-4 text-gray-400">
              Join our Discord channel or follow us on Twitter to keep up to date with our latest work and announcements.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <FaDiscord />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white">How it works</Link></li>
              <li><Link href="/roadmap" className="text-gray-400 hover:text-white">Roadmap</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/documentation" className="text-gray-400 hover:text-white">Documentation</Link></li>
              <li><Link href="/web3dev" className="text-gray-400 hover:text-white">Web3Dev</Link></li>
              <li><Link href="/linktree" className="text-gray-400 hover:text-white">LinkTree</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Dexgrator. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
