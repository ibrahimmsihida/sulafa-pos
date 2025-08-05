import React, { useState } from 'react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Start Free Trial button click
  const handleStartTrial = async (planName) => {
    setIsLoading(true);
    try {
      setSelectedPlan(planName);
      console.log(`Starting free trial for ${planName} plan`);
      showNotification(`🎉 Free trial started for ${planName} plan! Check your email for setup instructions.`);
      // Here you would typically redirect to signup or show a modal
    } catch (error) {
      showNotification('❌ Failed to start trial. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Contact Sales button click
  const handleContactSales = () => {
    console.log('Contact Sales clicked');
    showNotification('📞 Redirecting to contact form...');
    // Simulate redirect delay
    setTimeout(() => {
      showNotification('💬 Our sales team will contact you within 24 hours!');
    }, 1000);
    // Here you would typically open a contact form or redirect to contact page
  };

  // Handle Schedule Demo button click
  const handleScheduleDemo = () => {
    console.log('Schedule Demo clicked');
    showNotification('📅 Opening demo scheduler...');
    // Simulate redirect delay
    setTimeout(() => {
      showNotification('✅ Demo scheduled! You will receive a confirmation email shortly.');
    }, 1000);
    // Here you would typically open a scheduling widget or redirect to booking page
  };

  const plans = [
    {
      name: 'Starter Plan',
      price: {
        monthly: 19,
        yearly: 15.2 // 20% discount for yearly
      },
      description: 'Perfect for small businesses getting started',
      features: [
        'Single Location',
        'Single Register',
        'Up to 5,000 Products',
        'Limited Support',
        'WooCommerce Integration',
        'QuickBooks Integration',
        'Batch & Serial Product Management'
      ],
      popular: false,
      color: 'blue'
    },
    {
      name: 'Professional Plan',
      price: {
        monthly: 49,
        yearly: 39.2 // 20% discount for yearly
      },
      description: 'Ideal for growing businesses with multiple locations',
      features: [
        'Multiple Locations',
        'Unlimited Registers',
        'Unlimited Products',
        'Priority Support',
        'WooCommerce Integration',
        'QuickBooks Integration',
        'Advanced Batch & Serial Management',
        'Advanced Analytics',
        'Multi-user Access'
      ],
      popular: true,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start with a 7-day free trial, then choose the plan that fits your business needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => {
                setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
                console.log(`Billing cycle changed to: ${billingCycle === 'monthly' ? 'yearly' : 'monthly'}`);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-110 ${
                billingCycle === 'yearly' ? 'bg-blue-600 shadow-lg' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title={`Switch to ${billingCycle === 'monthly' ? 'yearly' : 'monthly'} billing`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
                  billingCycle === 'yearly' ? 'translate-x-6 scale-110' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Free Trial Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <h3 className="text-2xl font-bold text-gray-900">7-Day Free Trial</h3>
          </div>
          <p className="text-gray-700 text-lg">
            Try any plan risk-free for 7 days. No credit card required to start your trial.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                plan.popular 
                  ? 'border-purple-500 transform scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              } ${selectedPlan === plan.name ? 'ring-4 ring-green-300 border-green-400' : ''}`}
              onClick={() => console.log(`Plan clicked: ${plan.name}`)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-600 ml-2">
                      / {billingCycle === 'monthly' ? 'month' : 'month (billed yearly)'}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleStartTrial(plan.name)}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    } ${selectedPlan === plan.name ? 'ring-4 ring-green-300 bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Starting Trial...</span>
                      </div>
                    ) : selectedPlan === plan.name ? (
                      '✓ Trial Started!'
                    ) : (
                      'Start Free Trial'
                    )}
                  </button>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg mb-4">What's included:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the perfect plan for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleContactSales}
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              📞 Contact Sales
            </button>
            <button 
              onClick={handleScheduleDemo}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              📅 Schedule Demo
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">What happens after the free trial?</h4>
              <p className="text-gray-600">
                After your 7-day free trial ends, you'll need to choose a paid plan to continue using the service. 
                You can upgrade, downgrade, or cancel at any time.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">Can I change plans later?</h4>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">Is there a setup fee?</h4>
              <p className="text-gray-600">
                No setup fees! The price you see is exactly what you'll pay. No hidden costs or surprise charges.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h4>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;