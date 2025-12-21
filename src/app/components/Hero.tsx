import Link from 'next/link';

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure Your Digital Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            ApniSec provides comprehensive cybersecurity solutions including Cloud Security, 
            VAPT testing, and Reteam Assessments to protect your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Get Started
            </Link>
            <Link href="#services" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}