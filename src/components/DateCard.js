import React, { useEffect, useState } from "react";
import moment from "moment-hijri";

const DateCard = ({ nextPrayerTime, countdown }) => {
  const [albanianDate, setAlbanianDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    const now = moment();
    setAlbanianDate(
      now.toDate().toLocaleDateString("sq-AL", {
        weekday: "short",
        month: "long",
        day: "numeric",
      })
    );
    setHijriDate(moment().format("iMMMM iD, iYYYY"));
  }, []);

  const getPrayerTimePhrase = (name) => {
    switch (name) {
      case "Imsaku":
        return "deri në Imsak";
      case "Agimi":
        return "deri në Agim";
      case "Dreka":
        return "deri në Drekë";
      case "Ikindia":
        return "deri në Ikindi";
      case "Akshami":
        return "deri në Aksham";
      case "Jacia":
        return "deri në Jaci";
      default:
        return "deri në namaz";
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md w-full max-w-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </h3>
          <p className="text-sm text-gray-500">
            {getPrayerTimePhrase(nextPrayerTime?.name || "Imsaku")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">{albanianDate}</p>
          <p className="text-gray-500">{hijriDate} AH</p>
        </div>
      </div>
    </div>
  );
};

export default DateCard;
