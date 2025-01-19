import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment-hijri";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";
import DateCard from "../components/DateCard";

const MosqueDetailPage = () => {
  const { id } = useParams();
  const [mosque, setMosque] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [nextPrayerTime, setNextPrayerTime] = useState(null);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchMosque = async () => {
      try {
        const response = await fetch(
          `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${id}`
        );
        const data = await response.json();
        setMosque(data);
        setPrayerTimes(data.prayerTimes || []);
      } catch (error) {
        console.error("Error fetching mosque:", error);
      }
    };
    fetchMosque();
  }, [id]);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      calculateNextPrayerTime();
    }
  }, [prayerTimes]);

  const calculateNextPrayerTime = () => {
    const now = moment();
    const nextPrayer = prayerTimes.find((prayer) =>
      moment(prayer.time, "HH:mm").isAfter(now)
    );

    if (nextPrayer) {
      setNextPrayerTime(nextPrayer);
      calculateCountdown(nextPrayer.time);
    }
  };

  const calculateCountdown = (time) => {
    const now = moment();
    const targetTime = moment(time, "HH:mm");
    const duration = moment.duration(targetTime.diff(now));
    setCountdown({
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    });
  };

  if (!mosque) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-primary font-semibold">
          Duke ngarkuar...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center px-6 py-12">
        <h1 className="text-2xl lg:text-4xl font-semibold text-primary mb-2 text-center">
          {mosque.emri}
        </h1>
        <img
          src={mosque.imageUrl}
          alt={mosque.emri}
          className="w-full max-w-3xl h-64 sm:h-80 object-cover rounded-lg mb-6"
        />
        <p className="text-base lg:text-xl mb-4">
          <strong>Adresa:</strong> {mosque.adresa}
        </p>
        {mosque.kontakti && (
          <p className="text-base lg:text-xl mb-4">
            <strong>Kontakti:</strong>{" "}
            <a href={`tel:${mosque.kontakti}`} className="text-blue-600">
              {mosque.kontakti}
            </a>
          </p>
        )}
        {mosque.website && (
          <p className="text-base lg:text-xl mb-4 w-full text-center overflow-x-auto">
            <strong>Website:</strong>{" "}
            <a
              href={mosque.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 break-words"
            >
              {mosque.website}
            </a>
          </p>
        )}
        

        <DateCard nextPrayerTime={nextPrayerTime} countdown={countdown} />
      </div>
      <Footer />
    </div>
  );
};

export default MosqueDetailPage;
