//src/Components/StatsCard.jsx
const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
};

export default StatsCard;