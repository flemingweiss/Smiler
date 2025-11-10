import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submittedEmails, setSubmittedEmails] = useState([])
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set())

  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    }

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (section1Ref.current) observer.observe(section1Ref.current)
    if (section2Ref.current) observer.observe(section2Ref.current)
    if (section3Ref.current) observer.observe(section3Ref.current)

    return () => observer.disconnect()
  }, [])

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setIsValidEmail(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setIsValidEmail(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      // For nhost: use /waitlist (VITE_API_URL includes /v1/functions)
      // For local dev: use /api/waitlist
      const endpoint = apiUrl.includes('nhost.run') ? '/waitlist' : '/api/waitlist';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      // Success!
      setSubmittedEmails([...submittedEmails, email])
      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 8000)
    } catch (error) {
      console.error('Error joining waitlist:', error)
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden relative bg-white">

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20 sm:pb-32">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center space-y-6 sm:space-y-10 animate-slide-up">
            {/* Badge - Coming Soon to iOS */}
            <div className="inline-flex items-center space-x-2 glass-strong rounded-full px-4 py-2 sm:px-6 sm:py-2.5 shadow-subtle hover:shadow-medium transition-all duration-500">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-black tracking-wide">Coming Soon to iOS</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight leading-tight px-2">
              <span className="block text-black">
                <span className="inline-block bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl mr-3 sm:mr-4">
                  Smiler
                </span>
               - Transform Your
              </span>
              <span className="block text-black mt-2">
                Dental Health with AI
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed sm:leading-loose-plus tracking-wide px-4">
              Track your smile, discover what works, and watch your dental health improve every day with Smiler.
            </p>

            {/* Email Form */}
            <div className="max-w-md mx-auto mt-8 sm:mt-16 px-4">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setIsValidEmail(true)
                        setErrorMessage('')
                      }}
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl glass-strong ${
                        isValidEmail && !errorMessage ? 'border-gray-200 focus:border-black' : 'border-red-400'
                      } focus:outline-none focus:shadow-medium transition-all duration-500 text-sm sm:text-base text-gray-700 placeholder-gray-400 hover:glass-card disabled:opacity-60 disabled:cursor-not-allowed`}
                    />
                    {!isValidEmail && (
                      <p className="text-red-500 text-sm mt-2 text-left ml-2">Please enter a valid email address</p>
                    )}
                    {errorMessage && (
                      <p className="text-red-500 text-sm mt-2 text-left ml-2">{errorMessage}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center tracking-wide text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Joining...
                      </>
                    ) : (
                      'Join the Waitlist'
                    )}
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-4 tracking-wide">We will never spam you</p>
                </form>
              ) : (
                <div className="glass-strong rounded-xl px-4 py-6 sm:px-6 sm:py-8 shadow-medium animate-fade-in">
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-black">You're on the list!</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">Check your email for confirmation!</p>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-12 sm:mt-20 text-xs sm:text-sm px-4">
              <div className="flex items-center space-x-1.5 sm:space-x-2 glass px-3 py-2 sm:px-5 sm:py-3 rounded-full hover:glass-strong transition-all duration-500 hover:shadow-medium">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-black tracking-wide whitespace-nowrap">Privacy-First</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 glass px-3 py-2 sm:px-5 sm:py-3 rounded-full hover:glass-strong transition-all duration-500 hover:shadow-medium">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span className="font-semibold text-black tracking-wide whitespace-nowrap">AI-Powered</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Scrollable Features Section with iPhone Mockups */}
      
      {/* Feature Section 1 - See Your Smile Transform */}
      <section 
        id="feature-1"
        ref={section1Ref}
        className="relative z-10 min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
            {/* iPhone Mockup - Left */}
            <div className={`transition-all duration-1000 ${
              visibleSections.has('feature-1')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
            }`}>
              <div className="w-full max-w-xs sm:max-w-sm mx-auto lg:mx-0">
                <img
                  src="/assets/1.png"
                  alt="Smile Timeline - Weekly photo tracking showing progress"
                  className="w-full h-auto transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Explanation - Right */}
            <div className={`transition-all duration-1000 delay-300 ${
              visibleSections.has('feature-1') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-20'
            }`}>
              <div className="space-y-6 sm:space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-black leading-tight tracking-tight">
                  See Your Smile Transform
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed sm:leading-loose-plus">
                  AI analyzes your photos to show how your smile improves over time. Watch the magic happen as your healthy habits pay off!
                </p>
                <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Weekly photo tracking</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">AI-powered analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Progress visualization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - Discover What Works */}
      <section 
        id="feature-2"
        ref={section2Ref}
        className="relative z-10 min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
            {/* iPhone Mockup - First on mobile, Right on desktop */}
            <div className={`transition-all duration-1000 order-1 lg:order-2 ${
              visibleSections.has('feature-2') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-20'
            }`}>
              <div className="w-full max-w-lg sm:max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
                <img 
                  src="/assets/2.png" 
                  alt="Your Insights - Detailed analytics and habit tracking" 
                  className="w-full h-auto transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Explanation - Second on mobile, Left on desktop */}
            <div className={`transition-all duration-1000 delay-300 order-2 lg:order-1 ${
              visibleSections.has('feature-2') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-20'
            }`}>
              <div className="space-y-6 sm:space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-black leading-tight tracking-tight">
                  Discover What Works For You
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed sm:leading-loose-plus">
                  Track your habits and see what actually makes your teeth healthier. No more guessing—just results!
                </p>
                <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Smart habit tracking</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Detailed analytics</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Correlation insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3 - Personal Dental Coach */}
      <section 
        id="feature-3"
        ref={section3Ref}
        className="relative z-10 min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
            {/* iPhone Mockup - Left */}
            <div className={`transition-all duration-1000 ${
              visibleSections.has('feature-3') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-20'
            }`}>
              <div className="w-full max-w-lg sm:max-w-2xl mx-auto lg:mx-0">
                <img 
                  src="/assets/3.png" 
                  alt="Your AI Coach - Personalized tips and recommendations" 
                  className="w-full h-auto transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Explanation - Right */}
            <div className={`transition-all duration-1000 delay-300 ${
              visibleSections.has('feature-3') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-20'
            }`}>
              <div className="space-y-6 sm:space-y-8">
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-black leading-tight tracking-tight">
                  Get Your Personal Dental Coach
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed sm:leading-loose-plus">
                  Receive smart tips personalized just for you and your routine. It's like having a friendly dentist in your pocket!
                </p>
                <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Daily personalized tips</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">AI-driven insights</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-700 glass px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:glass-strong transition-all duration-500">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium tracking-wide">Custom goals & streaks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 tracking-tight px-4">
              And There's More...
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed sm:leading-loose-plus px-4">
              Additional features that make Smiler the complete dental health companion
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Additional Feature 1 */}
            <div className="group glass-card rounded-2xl p-6 sm:p-8 hover:glass-strong transition-all duration-500 hover:-translate-y-2 hover:shadow-medium">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3 tracking-tight">Your Data Stays Yours</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:leading-loose-plus">
                Everything is private and safe on your phone. We don't peek at your smile or sell your info. Ever.
              </p>
            </div>

            {/* Additional Feature 2 */}
            <div className="group glass-card rounded-2xl p-6 sm:p-8 hover:glass-strong transition-all duration-500 hover:-translate-y-2 hover:shadow-medium">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3 tracking-tight">Watch Your Progress Grow</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:leading-loose-plus">
                Beautiful charts show how you're doing. Celebrate your wins and see your healthy habits add up!
              </p>
            </div>

            {/* Additional Feature 3 */}
            <div className="group glass-card rounded-2xl p-6 sm:p-8 hover:glass-strong transition-all duration-500 hover:-translate-y-2 hover:shadow-medium sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3 tracking-tight">Run Your Own Experiments</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed sm:leading-loose-plus">
                Try different toothpastes or routines and see which works best. Be a scientist with your own smile!
              </p>
            </div>
          </div>
        </div>
      </section>

     
      {/* Final CTA Section */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6 tracking-tight px-4">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 sm:mb-16 leading-relaxed sm:leading-loose-plus px-4">
            Join thousands of people already on the waitlist for Smiler
          </p>
          
          <div className="max-w-md mx-auto px-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setIsValidEmail(true)
                      setErrorMessage('')
                    }}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl glass-strong ${
                      isValidEmail && !errorMessage ? 'border-gray-200 focus:border-black' : 'border-red-400'
                    } focus:outline-none focus:shadow-medium transition-all duration-500 text-sm sm:text-base text-gray-700 placeholder-gray-400 hover:glass-card disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  {!isValidEmail && (
                    <p className="text-red-500 text-sm mt-2 text-left ml-2">Please enter a valid email address</p>
                  )}
                  {errorMessage && (
                    <p className="text-red-500 text-sm mt-2 text-left ml-2">{errorMessage}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center tracking-wide text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    'Join the Waitlist'
                  )}
                </button>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-4 tracking-wide">We will never spam you</p>
              </form>
            ) : (
              <div className="glass-strong rounded-xl px-4 py-6 sm:px-6 sm:py-8 shadow-medium animate-fade-in">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-bold text-black">You're on the list!</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">Check your email for confirmation!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default App

