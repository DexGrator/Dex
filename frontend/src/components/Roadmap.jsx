import Image from 'next/image'

export default function Roadmap() {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-white">The </span>
          <span className="text-[#6100FF]">Roadmap</span>
        </h2>
        <div className="relative w-full h-[400px] md:h-[800px] lg:h-[1000px] xl:h-[1200px]">
          <Image
            src="/roadmap.png"
            alt="Roadmap"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}