//src/Components/DueAlertCard.jsx
const DueAlertCard = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
      <p className="font-semibold">Reminder:</p>
      <p>You have 1 book due today. Return to avoid fines.</p>
    </div>
  );
};

export default DueAlertCard;