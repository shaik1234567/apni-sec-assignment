export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-primary-600 text-white px-3 py-1 rounded font-bold text-xl inline-block mb-4">
              ApniSec
            </div>
            <p className="text-gray-300 max-w-md">
              Your trusted cybersecurity partner. We provide comprehensive security solutions 
              including Cloud Security, VAPT, and Reteam Assessments.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Cloud Security</li>
              <li>VAPT Testing</li>
              <li>Reteam Assessment</li>
              <li>Security Consulting</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@apnisec.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Security St</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; 2024 ApniSec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}