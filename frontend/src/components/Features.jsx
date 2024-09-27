import { Globe, ArrowRightLeft, Shield, Eye } from 'lucide-react'

const features = [
  { icon: Globe, title: 'MultiSwap', description: 'Atomic Multi Swap' },
  { icon: ArrowRightLeft, title: 'Best Route', description: 'Best Price and Route for Swapping' },
  { icon: Shield, title: 'MEV Protection', description: 'MEV Secure transaction with less Fee' },
  { icon: Eye, title: 'Security', description: 'All the Tnx\'s are distributed over the network' },
]

export default function Features() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Aggregator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}