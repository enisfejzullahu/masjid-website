<div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl py-8 px-6 md:py-10 md:px-12 flex flex-col md:flex-row items-center justify-center mb-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl">
  {/* Left Section: Countdown */}
  <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
    <Countdown
      nextPrayerTime={nextPrayerTime}
      nextPrayerName={nextPrayerName}
      prayerTimes={prayerTimes}
      setNextPrayerTime={setNextPrayerTime}
      setNextPrayerName={setNextPrayerName}
    />
  </div>

  {/* Divider */}
  {/* Horizontal Divider for Mobile */}
  <div className="w-full h-0.5 bg-gradient-to-r from-primary to-secondary my-6 md:hidden"></div>
  {/* Vertical Divider for Desktop */}
  <div className="hidden md:block h-20 w-0.5 bg-gradient-to-b from-primary to-secondary mx-6"></div>

  {/* Right Section: Date */}
  <div className="w-full md:w-auto text-center">
    <p className="text-xl sm:text-2xl font-medium text-gray-800 mb-2">
      {moment().locale("sq").format("dddd, D MMMM")}
    </p>
    <p className="text-xl sm:text-2xl font-medium text-primary">
      {hijriDate} H
    </p>
  </div>
</div>;
