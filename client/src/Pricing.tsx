import { useState } from 'react';
import api from './lib/api';
import { Check } from 'lucide-react'; // You might need to install this, see below

// PRO TIP: Define your data outside the component.
// This keeps your UI logic clean.
const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    description: 'Perfect for side projects',
    features: ['1 Tenant', 'Basic Audit Logs', 'Community Support'],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Enterprise',
    price: '$99',
    description: 'For serious business',
    features: ['Unlimited Tenants', 'Real-time Audit', '24/7 Phone Support', 'SSO'],
    recommended: true, // We will use this to style this card differently
  }
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    try {
      // SIMULATION: In real life, this redirects to Stripe.
      // For now, we hit our API to "mock" the upgrade.
      await api.post('/tenants/upgrade', { planId });
      alert('Success! You are now on the ' + planId + ' plan.');
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Payment Failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Unlock the full power of the Enterprise SaaS Manager.
        </p>
      </div>

      {/* PRO TIP: Use CSS Grid for responsive layouts.
          grid-cols-1 (Mobile) -> grid-cols-2 (Tablet+)
          gap-8 adds breathing room. */}
      <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-none">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            // PRO TIP: Conditional Class Names
            // If it's recommended, we add a border and shadow to make it "pop".
            className={`flex flex-col rounded-2xl shadow-sm bg-white overflow-hidden transition-all duration-200 hover:shadow-lg
              ${plan.recommended ? 'ring-2 ring-brand-500 transform scale-105' : 'border border-gray-200'}
            `}
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
              </p>
              <p className="mt-6 text-gray-500">{plan.description}</p>

              {/* Feature List */}
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex">
                    {/* We need an icon here. For now, using a simple SVG */}
                    <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-50 mt-auto">
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 px-6 rounded-md shadow text-sm font-medium text-white transition-colors
                  ${plan.recommended 
                    ? 'bg-brand-600 hover:bg-brand-700' 
                    : 'bg-gray-800 hover:bg-gray-900'}
                `}
              >
                {loading === plan.id ? 'Processing...' : `Buy ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}