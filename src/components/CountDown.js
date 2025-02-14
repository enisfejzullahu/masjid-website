import React, { useState, useEffect } from "react";
import moment from "moment";

const Countdown = ({
  nextPrayerTime,
  nextPrayerName,
  prayerTimes,
  setNextPrayerTime,
  setNextPrayerName,
}) => {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPrayerTimeReached, setIsPrayerTimeReached] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState(null);

  // Function to calculate the countdown
  const calculateCountdown = () => {
    if (!nextPrayerTime) return { hours: 0, minutes: 0, seconds: 0 };

    const duration = moment.duration(nextPrayerTime.diff(moment()));
    return {
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  // Update countdown state and prayer time when the next prayer time is reached
  useEffect(() => {
    // If there is no next prayer time, don't render anything
    if (!nextPrayerTime) return;

    // Initializing the countdown immediately when the component is mounted
    setCountdown(calculateCountdown());

    const interval = setInterval(() => {
      const remainingTime = calculateCountdown();
      setCountdown(remainingTime);

      // Check if prayer time has been reached
      if (
        remainingTime.hours === 0 &&
        remainingTime.minutes === 0 &&
        remainingTime.seconds === 0
      ) {
        setIsPrayerTimeReached(true);
        setCurrentPrayer(nextPrayerName);

        // Wait for 30 seconds after the prayer time and then calculate for the next prayer
        setTimeout(() => {
          const nextPrayerIndex = prayerTimes.findIndex(
            (prayer) => prayer.name === nextPrayerName
          );

          // If there are remaining prayers, set the next prayer time, otherwise calculate for tomorrow
          if (nextPrayerIndex < prayerTimes.length - 1) {
            const nextPrayer = prayerTimes[nextPrayerIndex + 1];
            setNextPrayerName(nextPrayer.name);
            setNextPrayerTime(nextPrayer.time);
          } else {
            // Handle the case for tomorrow's prayer time if today's prayers have finished
            const tomorrowPrayerTimes = prayerTimes.map((prayer) => ({
              ...prayer,
              time: prayer.time.add(1, "days"), // Add 1 day to each prayer time
            }));
            const firstPrayerOfTomorrow = tomorrowPrayerTimes[0];
            setNextPrayerName(firstPrayerOfTomorrow.name);
            setNextPrayerTime(firstPrayerOfTomorrow.time);
          }

          setIsPrayerTimeReached(false); // Reset after 30 seconds
        }, 20000);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [
    nextPrayerTime,
    prayerTimes,
    nextPrayerName,
    setNextPrayerName,
    setNextPrayerTime,
  ]);

  const prayerNameMapping = {
    Imsaku: "Imsak",
    Agimi: "Agim",
    Dreka: "Drekë",
    Ikindia: "Ikindi",
    Akshami: "Aksham",
    Jacia: "Jaci",
  };

  return (
    <div className="flex-2 text-center md:mb-0 md:pr-6">
      <div className="flex flex-col lg:items-start">
        {/* Display countdown when prayer time is not reached */}
        {!isPrayerTimeReached ? (
          <div className="flex items-center justify-center min-h-[10px]">
            <p className="text-3xl sm:text-4xl font-semibold text-primary tabular-nums">
              {String(countdown.hours).padStart(2, "0")}:
              {String(countdown.minutes).padStart(2, "0")}:
              {String(countdown.seconds).padStart(2, "0")}
            </p>
          </div>
        ) : (
          // When prayer time is reached, show message
          <p className="text-2xl sm:text-xl font-semibold text-primary">
            Koha e {currentPrayer} është tani
          </p>
        )}

        {/* Static Text (deri në X) */}
        {!isPrayerTimeReached && (
          <p className="text-base sm:text-lg text-primary">
            deri në {prayerNameMapping[nextPrayerName] || nextPrayerName}
          </p>
        )}
      </div>
    </div>
  );
};

export default Countdown;
