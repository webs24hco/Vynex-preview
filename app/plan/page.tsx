import { Check, Crown, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "/month",
    description: "Perfect to get started",
    icon: Zap,
    features: [
      "Up to 20 clients",
      "Basic appointment scheduling",
      "Manual reminders",
      "1 service provider",
    ],
    cta: "Current Plan",
    current: true,
    featured: false,
  },
  {
    name: "Pro",
    price: "€19",
    period: "/month",
    description: "For growing beauty pros",
    icon: Sparkles,
    features: [
      "Unlimited clients",
      "Smart scheduling",
      "WhatsApp auto-reminders",
      "Revenue analytics",
      "Client notes & history",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    current: false,
    featured: true,
  },
  {
    name: "Studio",
    price: "€49",
    period: "/month",
    description: "For teams & salons",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Team calendar view",
      "Advanced analytics",
      "Custom branding",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Upgrade to Studio",
    current: false,
    featured: false,
  },
];

export default function PlanPage() {
  return (
    <div className="px-5 pt-6 space-y-5 pb-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-plum">Choose Your Plan</h1>
        <p className="text-xs text-plum-light mt-1">Unlock premium features for your business</p>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`rounded-2xl p-5 shadow-sm border transition-all ${
                plan.featured
                  ? "bg-white border-rose ring-2 ring-rose/20 relative"
                  : plan.current
                  ? "bg-white border-rose-light/30"
                  : "bg-white border-rose-light/20"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-rose text-white text-[10px] font-semibold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.featured ? "bg-rose/15 text-rose" : "bg-gold/30 text-plum"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-plum">{plan.name}</h3>
                    <p className="text-[11px] text-plum-light">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-plum">{plan.price}</span>
                  <span className="text-xs text-plum-light">{plan.period}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check size={14} className={plan.featured ? "text-rose" : "text-green-500"} />
                    <span className="text-xs text-plum">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  plan.current
                    ? "bg-plum/5 text-plum-light cursor-default"
                    : plan.featured
                    ? "bg-rose text-white hover:bg-rose-dark shadow-sm"
                    : "bg-white text-rose border border-rose hover:bg-rose/5"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Note */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-plum-light">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
        <p className="text-[11px] text-plum-light mt-1">
          Need a custom plan? <span className="text-rose font-medium">Contact us</span>
        </p>
      </div>
    </div>
  );
}
