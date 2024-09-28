const roadmapItems = [
    { quarter: 'Q1 - 2024', title: 'MVP', description: 'Implementation of the protocol on W3D DAO, ensuring cost and time reduction.' },
    { quarter: 'Q2 - 2024', title: 'SubGraph + Backend', description: 'Web3Task indexing and server, improved data collection, metrics, user experience, and API.' },
    { quarter: 'Q2 - 2024', title: 'Partnerships', description: 'Marketing to create partnerships with companies, educational institutions, communities, and DAOs for Web3Task SDK implementation.' },
    { quarter: 'Q2 - 2024', title: 'Analysis ', description: 'Interactive activity panel and information control at the front-end level, creating a safer Earn2Learn environment.' },
    { quarter: 'Q3 - 2024', title: 'Taxation', description: 'Fee charging for task creation and API ensures Web3task viability, both for tool maintenance and new feature implementation.' },
    { quarter: 'Q3 - 2024', title: 'Expanding Horizons', description: 'Create a Hub for developers, facilitating user integration, providing supply for the growing demand of web3 projects.' },
  ]
  
  export default function Roadmap() {
    return (
      <section className="bg-black text-white py-20" id="roadmap">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Roadmap</h2>
          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 w-24 text-right">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-black font-bold py-2 px-4 rounded">
                    {item.quarter}
                  </div>
                </div>
                <div className="ml-8 border-l-2 border-gray-700 pl-8 pb-8">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
