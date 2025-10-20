import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import api from '@/lib/axios';
import { ApiResponse } from '@/types';

export default function HomePage() {
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState<{ qrCodeDataURL: string; driverName: string } | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Prevent flash of content before redirect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post<ApiResponse<{
        qrCodeDataURL: string;
        driverName: string;
      }>>('/qr/request-qrcode', { 
        phoneNumber: phone, 
        dateOfBirth: dob 
      });
      
      if (response.data.data) {
        setQrData({
          qrCodeDataURL: response.data.data.qrCodeDataURL,
          driverName: response.data.data.driverName
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get QR code');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-700">
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Driver Verification System</h1>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Admin/Staff Login
            </button>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Driver Verification</span>
            <span className="block text-blue-600">Made Simple</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get your digital driver verification QR code instantly. No more carrying physical documents.
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-16">
          <div className="px-4 py-5 sm:p-6">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="mb-8 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your Driver QR Code</h2>
                
                {/* Demo Credentials */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
                  <h3 className="font-medium text-blue-800 mb-2">Test Driver Details:</h3>
                  <div className="space-y-2 text-blue-700">
                    <p><span className="font-medium">Phone:</span> +2347000000001</p>
                    <p><span className="font-medium">Date of Birth:</span> 1990-01-01</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPhone('+2347000000001');
                        setDob('1990-01-01');
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Click to fill test details
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Get My QR Code'}
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center">
                {qrData ? (
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your QR Code</h3>
                    <p className="text-sm text-gray-600 mb-4">Hello, <span className="font-medium">{qrData.driverName}</span>!</p>
                    <div className="flex justify-center mb-4">
                      <img
                        src={qrData.qrCodeDataURL}
                        alt="Driver QR Code"
                        className="h-48 w-48 border-4 border-white shadow-md rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <a
                        href={qrData.qrCodeDataURL}
                        download={`${qrData.driverName}-qr-code.png`}
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download QR Code
                      </a>
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                        Print
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-48 w-48 rounded-full bg-blue-50 mb-4">
                      <svg className="h-24 w-24 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11h3l1.5-2H12m-5.5 2H4m13 0h-1.5m-10 0H4m13 0h1.5m-10 0h-1.5m10 0h1.5M4 15h1.5m10 0h1.5m-10 0h1.5m10 0h1.5m-10 0h1.5M4 19h1.5m10 0h1.5m-10 0h1.5m10 0h1.5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Get Your QR Code</h3>
                    <p className="text-sm text-gray-500">Fill in your details to generate your personal QR code for verification.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-16">
          <div className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Why Use Our Verification System?
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Experience the future of driver verification with our secure and efficient system.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'Secure & Private',
                  description: 'Your information is encrypted and only accessible to authorized personnel.'
                },
                {
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Instant Verification',
                  description: 'Get your QR code instantly after verification.'
                },
                {
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  ),
                  title: 'Cloud Storage',
                  description: 'Access your QR code anytime, anywhere with our secure cloud storage.'
                },
                {
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: 'No Paperwork',
                  description: 'Go digital and reduce the need for physical documents.'
                },
                {
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: 'Secure Access',
                  description: 'Only authorized personnel can verify your credentials.'
                },
                {
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Lightning Fast',
                  description: 'Quick verification process that saves you time.'
                }
              ].map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        {feature.icon}
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-16">
          <div className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Get your driver verification QR code in just a few simple steps.
              </p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-0 left-1/2 h-full w-1 bg-blue-100 transform -translate-x-1/2"></div>
              
              <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                {[
                  {
                    number: '1',
                    title: 'Enter Your Details',
                    description: 'Provide your phone number and date of birth for verification.'
                  },
                  {
                    number: '2',
                    title: 'Get Verified',
                    description: 'Our system will verify your information against our records.'
                  },
                  {
                    number: '3',
                    title: 'Download QR Code',
                    description: 'Once verified, download your personal QR code for verification.'
                  }
                ].map((step, index) => (
                  <div key={index} className="relative md:text-center">
                    <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="md:mt-16">
                      <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                      <p className="mt-2 text-base text-gray-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to get started?</span>
                <span className="block text-blue-200">Get your QR code today.</span>
              </h2>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <a
                    href="#qr-form"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Get Your QR Code
                  </a>
                </div>
                <div className="ml-3 inline-flex">
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-200 bg-blue-600 hover:bg-blue-700"
                  >
                    Admin Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
