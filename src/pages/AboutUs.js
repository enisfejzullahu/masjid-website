import React from "react";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";

import AppStoreLogo from "../../src/assets/AppStoreLogo.svg"; // Replace with actual path
import PlayStoreLogo from "../../src/assets/PlayStoreLogo.svg"; // Replace with actual path
import PhoneMockups from "../../src/assets/PhoneMockup2.png"; // Replace with actual path

const AboutPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="relative pb-14 lg:py-12">
        <div className="container mx-auto px-6 sm:px-12">
          {/* Page Title */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-primary text-center mt-14 lg:mt-8 mb-10">
            Rreth Nesh
          </h1>

          {/* About Us Text */}
          <section className="mb-12 text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Xhamia Ime</strong> është një aplikacion inovativ që synon
              të lidhë xhematin me xhaminë e tyre në mënyrën më të lehtë dhe
              efikase. Ky aplikacion është krijuar për të qenë një urë
              komunikimi midis xhematit dhe xhamisë, duke përmirësuar përvojën e
              përdoruesit.
            </p>
          </section>

          {/* Qëllimi i Aplikacionit */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              Qëllimi i Aplikacionit
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Qëllimi ynë është të ofrojmë një platformë të thjeshtë dhe të
              sigurt për të gjithë xhematin që të informohen për oraret e
              namazit, të ndihmojnë xhaminë e tyre me donacione dhe të jenë në
              kontakt me njoftimet dhe aktivitetet e saj.
            </p>
          </section>

          {/* Misioni Ynë */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">Misioni Ynë</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Misioni ynë është të ndërtojmë një komunitet të fortë dhe të
              lidhur përmes teknologjisë, duke përdorur një aplikacion që
              pasqyron nevojat dhe vlerat e komunitetit mysliman.
            </p>
          </section>

          {/* Përse Vendosëm të Zhvillojmë këtë Aplikacion */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              Përse Vendosëm të Zhvillojmë këtë Aplikacion?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Me zhvillimin e teknologjisë dhe nevojën për informacion të
              menjëhershëm, pamë një mundësi për të sjellë një aplikacion që
              plotëson të gjitha nevojat e xhematit në lidhje me xhaminë.
            </p>
          </section>

          {/* Vizioni Ynë në të Ardhmen */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-6">
              Vizioni Ynë në të Ardhmen
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ne shohim një të ardhme ku çdo xhami dhe xhemat janë të lidhur për
              mes një platforme që ndihmon në rritjen dhe zhvillimin e
              komunitetit tonë.
            </p>
          </section>

          {/* Call-to-Action Section */}
          <section className="bg-primary text-white rounded-xl py-12 px-6 sm:px-12 mb-16">
            <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-8">
              {/* Left Content */}
              <div>
                <h3 className="text-3xl font-extrabold mb-6 text-center lg:text-left">
                  Një hap më afër xhamisë suaj
                </h3>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                  <img
                    src={AppStoreLogo}
                    alt="App Store"
                    className="h-12 cursor-pointer"
                  />
                  <img
                    src={PlayStoreLogo}
                    alt="Play Store"
                    className="h-12 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src={PhoneMockups}
                  alt="Phone Mockups"
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
