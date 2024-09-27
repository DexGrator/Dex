import Link from 'next/link'
// import { Button } from "@/components/ui/button"
import SolanaWalletConnect from './SolanaWalletConnect'

export default function Header() {
  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">WEB3TASK</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link href="/roadmap" className="hover:text-blue-400">Roadmap</Link></li>
            <li><Link href="/docs" className="hover:text-blue-400">Docs</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
          </ul>
        </nav>
        <div className="">
            <SolanaWalletConnect />
          </div>
        {/* <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          Swap Now
        </Button> */}
      </div>
    </header>
  )
}