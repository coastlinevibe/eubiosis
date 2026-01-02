import VisitorCounter from '@/components/VisitorCounter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Visits - Eubiosis',
  description: 'View the number of visitors to our site',
}

export default function VisitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Site Statistics
            </h1>
            <p className="text-lg text-gray-600">
              Welcome to our visitor tracking page. Here you can see how many people have visited our site.
            </p>
          </div>
          
          <div className="flex justify-center">
            <VisitorCounter />
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                About Our Visitor Counter
              </h3>
              <p className="text-gray-600">
                This counter tracks unique visits to our website and helps us understand 
                our reach and engagement with visitors interested in Eubiosis products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}