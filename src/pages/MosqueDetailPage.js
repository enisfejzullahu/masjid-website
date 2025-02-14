import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import momentHijri from "moment-hijri"; // For Hijri date formatting
import "moment/locale/sq";
import { FaMapMarkerAlt, FaPhone, FaGlobe } from "react-icons/fa";

import {
  getDatabase,
  ref,
  get,
  query,
  limitToFirst,
  onValue,
} from "firebase/database";
import { rtdb } from "../firebaseConfig";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";
import Countdown from "../components/CountDown"; // Import the Countdown component

import PlayStoreLogo from "../assets/PlayStoreLogo.svg";
import AppStoreLogo from "../assets/AppStoreLogo.svg";
import ImsakuPNG from "../assets/ImsakuPNG.png";
import AgimiPNG from "../assets/AgimiPNG.png";
import DrekaPNG from "../assets/DrekaPNG.png";
import IkindiaPNG from "../assets/IkindiaPNG.png";
import AkshamiPNG from "../assets/AkshamiPNG.png";
import JaciaPNG from "../assets/JaciaPNG.png";

import ImsakuFilledPNG from "../assets/ImsakuFilledPNG.png";
import AgimiFilledPNG from "../assets/AgimiFilledPNG.png";
import DrekaFilledPNG from "../assets/DrekaFilledPNG.png";
import IkindiaFilledPNG from "../assets/IkindiaFilledPNG.png";
import AkshamiFilledPNG from "../assets/AkshamiFilledPNG.png";
import JaciaFilledPNG from "../assets/JaciaFilledPNG.png";

const MosqueDetailPage = () => {
  const { id } = useParams();
  const [mosque, setMosque] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [nextPrayerName, setNextPrayerName] = useState(""); // Name of the next prayer
  const [nextPrayerTime, setNextPrayerTime] = useState(null); // Next prayer time\
  const [currentPrayerName, setCurrentPrayerName] = useState(null);

  const now = moment().toDate();
  moment.locale("en");

  const hijriDate = momentHijri().format("iMMMM iD, iYYYY");
  const timeoutRef = useRef(null); // Store the timeout reference

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const dbRef = ref(rtdb, "/");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const allData = Object.values(snapshot.val());

          const today = moment();
          const yesterday = moment().subtract(1, "days");

          const todayDate = today.date();
          const todayMonth = today.month() + 1;
          const yesterdayDate = yesterday.date();
          const yesterdayMonth = yesterday.month() + 1;

          const todayEntry = allData.find(
            (entry) => entry.Muaji === todayMonth && entry.Data === todayDate
          );
          const yesterdayEntry = allData.find(
            (entry) =>
              entry.Muaji === yesterdayMonth && entry.Data === yesterdayDate
          );

          if (todayEntry) {
            const currentTime = moment();

            const fetchedPrayerTimes = [
              { name: "Imsaku", time: moment(todayEntry.Imsaku, "HH:mm") },
              { name: "Agimi", time: moment(todayEntry.Agimi, "HH:mm") },
              { name: "Dreka", time: moment(todayEntry.Dreka, "HH:mm") },
              { name: "Ikindia", time: moment(todayEntry.Ikindia, "HH:mm") },
              { name: "Akshami", time: moment(todayEntry.Akshami, "HH:mm") },
              { name: "Jacia", time: moment(todayEntry.Jacia, "HH:mm") },
            ];

            let activePrayer = fetchedPrayerTimes
              .slice()
              .reverse()
              .find((prayer) => currentTime.isAfter(prayer.time));

            // 👇 **Fix: Keep yesterday's Jacia as active if today’s first prayer hasn't started**
            if (!activePrayer && yesterdayEntry) {
              const yesterdayJacia = moment(yesterdayEntry.Jacia, "HH:mm").add(
                1,
                "days"
              ); // Yesterday's Jacia, but shifted to today
              if (currentTime.isBefore(fetchedPrayerTimes[0].time)) {
                activePrayer = { name: "Jacia", time: yesterdayJacia };
              }
            }

            if (activePrayer) {
              setCurrentPrayerName(activePrayer.name);
            } else {
              setCurrentPrayerName(null);
            }

            const upcomingPrayers = fetchedPrayerTimes.filter((prayer) =>
              prayer.time.isAfter(currentTime)
            );

            if (upcomingPrayers.length > 0) {
              setNextPrayerName(upcomingPrayers[0].name);
              setNextPrayerTime(upcomingPrayers[0].time);
            } else {
              const tomorrowPrayerTimes = fetchedPrayerTimes.map((prayer) => ({
                ...prayer,
                time: prayer.time.add(1, "days"),
              }));
              setNextPrayerName(tomorrowPrayerTimes[0].name);
              setNextPrayerTime(tomorrowPrayerTimes[0].time);
            }

            setPrayerTimes(fetchedPrayerTimes);
          }
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching Realtime Database:", error);
      }
    };

    const setPrayerTimeout = () => {
      if (nextPrayerTime) {
        const timeUntilNextPrayer = nextPrayerTime.diff(
          moment(),
          "milliseconds"
        );

        if (timeUntilNextPrayer > 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            fetchRealtimeData();
          }, timeUntilNextPrayer);
        }
      }
    };

    fetchRealtimeData();
    setPrayerTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nextPrayerTime]);

  useEffect(() => {
    const fetchMosque = async () => {
      try {
        const response = await fetch(
          `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${id}`
        );
        const data = await response.json();
        setMosque(data);
      } catch (error) {
        console.error("Error fetching mosque:", error);
      }
    };
    fetchMosque();
  }, [id]);

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
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white"></div>
        <img
          src={mosque.imageUrl}
          alt={mosque.emri}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative flex flex-col items-center px-6 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28">
        <div className="bg-white shadow-xl rounded-2xl py-8 w-full max-w-3xl mb-6 lg:px-12 px-6 transform transition-all hover:scale-105 hover:shadow-2xl">
          {/* Mosque Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-8">
            {mosque.emri}
          </h1>

          {/* Mosque Info with Icons */}
          <div className="flex flex-col space-y-4">
            {/* Address */}
            <div className="flex items-center lg:justify-start space-x-3">
              <FaMapMarkerAlt className="text-primary text-xl" />
              <p className="text-lg lg:text-xl text-gray-800">
                {mosque.adresa}
              </p>
            </div>

            {/* Contact */}
            {mosque.kontakti && (
              <div className="flex items-center lg:justify-start space-x-3">
                <FaPhone className="text-primary text-xl" />
                <a
                  href={`tel:${mosque.kontakti}`}
                  className="text-lg lg:text-xl text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {mosque.kontakti}
                </a>
              </div>
            )}

            {/* Website */}
            {mosque.website && (
              <div className="flex items-center lg:justify-start space-x-3">
                <FaGlobe className="text-primary text-xl" />
                <a
                  href={mosque.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg lg:text-xl text-blue-600 hover:text-blue-700 transition-colors break-all"
                >
                  {mosque.website}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl py-8 px-6 md:py-10 md:px-12 flex flex-col md:flex-row items-center justify-center mb-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
          {/* Left Section: Countdown */}
          <div className="w-[180px] flex-shrink-0 flex justify-center">
            <Countdown
              nextPrayerTime={nextPrayerTime}
              nextPrayerName={nextPrayerName}
              prayerTimes={prayerTimes}
              setNextPrayerTime={setNextPrayerTime}
              setNextPrayerName={setNextPrayerName}
            />
          </div>

          {/* Divider (Horizontal on small screens, Vertical on medium screens) */}
          <div className="w-full md:w-0.5 h-0.5 md:h-16 bg-primary rounded mx-4 my-4 md:my-0"></div>

          {/* Right Section: Date */}
          <div className="w-full md:w-auto text-center">
            <p className="text-xl sm:text-2xl font-medium text-gray-800 mb-2">
              {moment().locale("sq").format("dddd, D MMMM")}
            </p>
            <p className="text-xl sm:text-2xl font-medium text-primary">
              {hijriDate} H
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-lg w-full max-w-3xl mb-12">
          {prayerTimes.map((prayer, index) => {
            let IconComponent;
            let isActive = prayer.name === currentPrayerName; // Check if this is the current prayer

            switch (prayer.name) {
              case "Imsaku":
                IconComponent = (
                  <img
                    src={isActive ? ImsakuFilledPNG : ImsakuPNG}
                    alt="Imsaku"
                    className="w-12 h-12 lg:w-16 object-contain transition-transform hover:scale-110"
                  />
                );
                break;
              case "Agimi":
                IconComponent = (
                  <img
                    src={isActive ? AgimiFilledPNG : AgimiPNG}
                    alt="Agimi"
                    className="w-12 h-12 lg:w-16 object-contain transition-transform hover:scale-110"
                  />
                );
                break;
              case "Dreka":
                IconComponent = (
                  <img
                    src={isActive ? DrekaFilledPNG : DrekaPNG}
                    alt="Dreka"
                    className="w-12 h-12 lg:w-16 object-contain transition-transform hover:scale-110"
                  />
                );
                break;
              case "Ikindia":
                IconComponent = (
                  <img
                    src={isActive ? IkindiaFilledPNG : IkindiaPNG}
                    alt="Ikindia"
                    className="w-12 h-12 lg:w-16 object-contain transition-transform hover:scale-110"
                  />
                );
                break;
              case "Akshami":
                IconComponent = (
                  <img
                    src={isActive ? AkshamiFilledPNG : AkshamiPNG}
                    alt="Akshami"
                    className="w-12 h-12 lg:w-16 object-contain transition-transform hover:scale-110"
                  />
                );
                break;
              case "Jacia":
                IconComponent = (
                  <img
                    src={isActive ? JaciaFilledPNG : JaciaPNG}
                    alt="Jacia"
                    className="w-12 h-12 lg:w-16 object-contain transition-transform hover:scale-110"
                  />
                );
                break;
              default:
                IconComponent = null;
            }

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-between p-6 rounded-2xl shadow-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white text-primary"
                    : "bg-gradient-to-r from-primary-light via-primary to-primary-dark text-white hover:shadow-2xl"
                }`}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  {IconComponent}
                </div>

                {/* Text */}
                <div className="flex flex-col items-center justify-center grow">
                  <p className="text-lg font-semibold text-center sm:text-xl md:text-2xl">
                    {prayer.name}
                  </p>
                  <p className="text-xl font-bold text-center sm:text-2xl md:text-3xl">
                    {prayer.time
                      ? prayer.time.format("HH:mm")
                      : "Time not available"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-primary p-6 text-center w-full max-w-3xl rounded-lg mb-12">
          <p className="text-white text-lg mb-4">
            Shiko të gjitha funksionet në aplikacion
          </p>

          <div className="flex justify-center space-x-4">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={PlayStoreLogo} alt="Google Play" className="w-40" />
            </a>
            <a
              href="https://www.apple.com/app-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={AppStoreLogo} alt="Apple Store" className="w-40" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MosqueDetailPage;
