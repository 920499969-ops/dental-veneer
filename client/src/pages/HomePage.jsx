import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WhatAreVeneers from '../components/WhatAreVeneers';
import BenefitsGrid from '../components/BenefitsGrid';
import BeforeAfterGallery from '../components/BeforeAfterGallery';
import ProcessTimeline from '../components/ProcessTimeline';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import MapSection from '../components/MapSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <WhatAreVeneers />
      <BenefitsGrid />
      <BeforeAfterGallery />
      <ProcessTimeline />
      <PricingSection />
      <TestimonialsCarousel />
      <MapSection />
      <FAQSection />
      <CTABanner />
      <Footer />
      <ChatWidget />
    </>
  );
}
