'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OurMission from "@/components/OurMission";
import PresidentMessage from "@/components/PresidentMessage";
import HomePrograms from "@/components/HomePrograms";
import CallToActionBanner from "@/components/CallToActionBanner";
import ShopBanner from "@/components/ShopBanner";
import Services from "@/components/Services";
import HomeOpportunities from "@/components/HomeOpportunities";
import HomeEvents from "@/components/HomeEvents";
import Articles from "@/components/Articles";
import HomeTeam from "@/components/HomeTeam";
import Courses from "@/components/Courses";
import HomeSpecialists from "@/components/HomeSpecialists";
import Stats from "@/components/Stats";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { useLanguage } from "@/lib/LanguageContext";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const { t, language } = useLanguage();
  const [shopEnabled, setShopEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.shop_enabled !== undefined) {
          setShopEnabled(data.configs.shop_enabled);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <Hero />
        <OurMission />
        <PresidentMessage />
        <HomePrograms />
        <CallToActionBanner />
        <ShopBanner shopEnabled={shopEnabled} />
        <Services />
        <HomeOpportunities />
        <HomeEvents />
        <Courses />
        <HomeSpecialists />
        <Articles />
        <HomeTeam />
        <Stats />
        
        <Footer shopEnabled={shopEnabled} />
      </main>

      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
