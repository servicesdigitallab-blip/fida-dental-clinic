import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import BeforeAfter from './components/BeforeAfter';
import Reviews from './components/Reviews';
import Team from './components/Team';
import ChatBot from './components/ChatBot';
import AppointmentPopup from './components/AppointmentPopup';
import ProtectionShield from './components/ProtectionShield';

function App() {
  return (
    <>
      <ProtectionShield />
      <Layout>
        <Hero />
        <Services />
        <WhyChooseUs />
        <BeforeAfter />
        <Reviews />
        <Team />
      </Layout>
      <ChatBot />
      <AppointmentPopup />
    </>
  );
}

export default App;



