import Link from "next/link";

// components/Plans.js
const Plans = () => (
  <section id="plans" className="py-16 bg-primary text-white px-4">
    <h3 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h3>
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      {[
        { title: "Trial", price: "Free", features: ["15 Products", "Basic Support", "Limited WhatsApp Integration"] },
        { title: "Lite", price: "₹199/mo", features: ["100 Products", "Basic Support", "WhatsApp Integration"] },
        { title: "Pro", price: "₹399/mo", features: ["Unlimited Products", "Priority Support", "Advanced Integrations"] },
        { title: "Enterprise", price: "₹799/mo", features: ["Unlimited Products", "24/7 Support", "Custom Features"] },
      ].map((plan, index) => (
        <div
          key={plan.title}
          className={`p-6 rounded-lg shadow-md ${
            plan.title === "Trial" ? "bg-gray-200 text-primary" : "bg-white text-primary"
          }`}
        >
          <h4 className="font-bold text-xl mb-2">{plan.title}</h4>
          <p className={`text-2xl font-semibold mb-4 ${plan.title === "Trial" ? "text-green-600" : "text-primary"}`}>
            {plan.price}
          </p>
          <ul className="list-disc list-inside">
            {plan.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <Link href="/admin" passHref>
          <button
            href="#"
            className={`mt-4 px-4 py-2 rounded-lg ${
              plan.title === "Trial" ? "bg-green-600 text-white" : "bg-primary text-white"
            }`}
          >
            {plan.title === "Trial" ? "Start Free Trial" : "Get Started"}
          </button>
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default Plans;