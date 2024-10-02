import Image from 'next/image'

const brands = [
  { name: 'Waverio', logo: '/a1.png' },
  { name: 'Logoipsum', logo: '/a2.png' },
  { name: 'Alterbone', logo: '/a3.png' },
  { name: 'Tinygone', logo: '/a4.png' },
  { name: 'Preso', logo: '/a5.png' },
  { name: 'Ridoria', logo: '/a6.png' },
  { name: 'Carbonia', logo: '/a8.png' },
  { name: 'Incanto', logo: '/a9.png' },
]

export default function Integration() {
  return (
    <section className="py-20 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Integration
        </h2>
        <p className="text-xl text-center text-gray-400 mb-12">
          Popular brands use Landingfolio
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={150}
                height={50}
                className="max-w-full h-auto"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="/a10.png"
            alt="Capterra"
            width={150}
            height={50}
            className="mb-4"
          />
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-400 text-sm">4.4/5 (14,590 Reviews)</p>
        </div>
      </div>
    </section>
  )
}