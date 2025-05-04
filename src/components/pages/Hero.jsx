'use client'
import Link from "next/link";
import { SignInButton, useUser } from '@clerk/nextjs';
const Hero = () => {
    const { user } = useUser();
    return (
        <>
           <div className="mx-auto max-w-7xl text-center mb-8 px-5 mt-16">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl mb-4">
            Empowering Farmers with AI Chatbot Assistance
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Welcome to our AI assistant chatbot for plant disease identification and farming 
            assistance. Get expert advice and solutions for your farming needs.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
          {user?<Link href="/services">
            <button className="bg-[#6faa61] hover:bg-green-700 text-white font-bold py-2 px-8 rounded-md text-xl">
              Get Started
            </button>
          </Link>:<SignInButton mode="modal">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-md">
              Get Started
            </button>
          </SignInButton>}
        </div>
        
        {/* Hero Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src="/pic1.png"
              alt="CropCare AI Assistant"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-16 mx-auto max-w-7xl grid md:grid-cols-2 gap-8">
          <div className="space-y-6 ">
            <h2 className="text-2xl font-bold text-gray-900">
              Empowering Farmers with AI: Discover the Future of Farming Assistance
            </h2>
            <p className="text-gray-600">
              Our AI assistant chatbot revolutionizes farming practices by providing real-time support and accurate plant disease identification.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time disease identification for healthier crops</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Optimize your farming practices with AI-powered insights</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Expert farming advice at your fingertips</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <img
                src="/pic2.png"
                alt="Healthy crops"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
        </>
    );
}

export default Hero;