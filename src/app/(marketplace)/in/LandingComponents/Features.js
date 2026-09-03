// components/Features.js
const Features = () => (
  <section id="features" className="py-16 bg-gray-100 text-primary px-4">
    <h3 className="text-3xl font-bold text-center mb-8">Features</h3>
    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: "Product Management", desc: "Upload products with images easily." },
        { title: "Customizable Pages", desc: "Design your eShop page for your brand." },
        { title: "WhatsApp Shopping", desc: "Direct customer purchases via WhatsApp." },
        // additional features
      ].map((feature) => (
        <div key={feature.title} className="p-6 bg-white shadow-md rounded-lg">
          <h4 className="font-bold text-xl mb-2">{feature.title}</h4>
          <p>{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;