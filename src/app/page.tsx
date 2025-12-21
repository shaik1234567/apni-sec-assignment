import Hero from './components/Hero';

export default function HomePage() {
  return (
    <div>
      <Hero />
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Security Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive cybersecurity solutions tailored to protect your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-semibold mb-4">Cloud Security</h3>
              <p className="text-gray-600">
                Secure your cloud infrastructure with comprehensive security assessments 
                and monitoring solutions.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-4">VAPT Testing</h3>
              <p className="text-gray-600">
                Vulnerability Assessment and Penetration Testing to identify and 
                fix security weaknesses.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-4">Reteam Assessment</h3>
              <p className="text-gray-600">
                Red team exercises to test your organization's security posture 
                and incident response capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ApniSec?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-600 text-sm">Certified security professionals</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Fast Response</h3>
              <p className="text-gray-600 text-sm">24/7 security monitoring</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Detailed Reports</h3>
              <p className="text-gray-600 text-sm">Comprehensive security analysis</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Compliance</h3>
              <p className="text-gray-600 text-sm">Industry standard compliance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}