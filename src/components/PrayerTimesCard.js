// Import the icons
import ImsakuIcon from "../assets/ImsakuIcon";
import AgimiIcon from "../assets/AgimiIcon";
import DrekaIcon from "../assets/DrekaIcon";
import IkindiaIcon from "../assets/IkindiaIcon";
import AkshamiIcon from "../assets/AkshamiIcon";
import JaciaIcon from "../assets/JaciaIcon";
// import ImsakuFilled from "../assets/ImsakuFilled";
// import AgimiFilled from "../assets/AgimiFilled";
// import DrekaFilled from "../assets/DrekaFilled";
// import IkindiaFilled from "../assets/IkindiaFilled";
// import AkshamiFilled from "../assets/AkshamiFilled";
// import JaciaFilled from "../assets/JaciaFilled";

// Mapping of prayer names to their respective icons
const prayerIcons = {
  Imsaku: { outline: ImsakuIcon },
  Agimi: { outline: AgimiIcon },
  Dreka: { outline: DrekaIcon },
  Ikindia: { outline: IkindiaIcon },
  Akshami: { outline: AkshamiIcon },
  Jacia: { outline: JaciaIcon },
};

const PrayerTimesCard = ({ prayerTimes }) => {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
      {prayerTimes.map((prayer, index) => {
        const { outline, filled } = prayerIcons[prayer.name] || {};
        const IconComponent = outline; // Use the outline version of the icon

        return (
          <div key={index} className="flex flex-col items-center">
            {/* Render the icon dynamically */}
            {IconComponent && <IconComponent className="w-8 h-8 mb-2" />}
            {/* Display the prayer name */}
            <p className="text-lg font-semibold">{prayer.name}</p>
            {/* Display the prayer time */}
            <p className="text-gray-700">{prayer.time.format("HH:mm")}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PrayerTimesCard;
