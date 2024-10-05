"use client";
import { useState, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'



const faqs = [
  {
    question: "What is Dexgrator?",
    answer: "Dexgrator is a cutting-edge platform that combines decentralized finance (DeFi) with advanced trading tools. Our goal is to provide users with a seamless and efficient way to participate in the crypto market while leveraging the benefits of decentralization."
  },
  {
    question: "How does Dexgrator ensure security?",
    answer: "At Dexgrator, security is our top priority. We employ industry-leading encryption standards, regular security audits, and smart contract reviews. Additionally, we use decentralized protocols to minimize the risk of single points of failure, ensuring that your assets remain safe and secure at all times."
  },
  {
    question: "What cryptocurrencies does Dexgrator support?",
    answer: "Dexgrator supports a wide range of cryptocurrencies, including but not limited to Bitcoin (BTC), Ethereum (ETH), and various ERC-20 tokens. We're constantly expanding our list of supported assets based on market demand and thorough vetting processes. Check our documentation for the most up-to-date list of supported cryptocurrencies."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const answerRefs = useRef([])

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-gray-600"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300" />
                )}
              </button>
              <div
                id={`faq-answer-${index}`}
                ref={el => answerRefs.current[index] = el}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: openIndex === index ? answerRefs.current[index]?.scrollHeight + 'px' : '0',
                  opacity: openIndex === index ? 1 : 0
                }}
              >
                <div className="p-4 bg-gray-900">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}