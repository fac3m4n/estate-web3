import { CheckCircleIcon } from "@heroicons/react/24/outline";

const roadmapItems = [
  {
    date: "Q4 2024",
    title: "Platform Launch",
    description: "Initial release of Estate with core features for property listing and viewing",
    completed: true,
  },
  {
    date: "Q1 2025",
    title: "Smart Contracts Integration",
    description: "Implementation of property tokenization and smart contract-based transactions",
    completed: false,
  },
  {
    date: "Q2 2025",
    title: "Advanced Features",
    description: "Introduction of bidding system and automated rental payments",
    completed: false,
  },
  {
    date: "Q3 2025",
    title: "Global Expansion",
    description: "Platform expansion to multiple countries and integration with local real estate regulations",
    completed: false,
  },
];

export default function Roadmap() {
  return (
    <div className="py-24 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roadmapItems.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleIcon className={`w-6 h-6 ${item.completed ? "text-primary" : "text-gray-300"}`} />
                <span className="text-primary font-semibold">{item.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
