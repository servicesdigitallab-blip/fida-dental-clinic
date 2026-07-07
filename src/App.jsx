import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import BeforeAfter from './components/BeforeAfter';
import Reviews from './components/Reviews';
import Team from './components/Team';
import Pricing from './components/Pricing';
import WarningPopup from './components/WarningPopup';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <>
      <WarningPopup />
      <Layout>
        <Hero />
        <Services />
        <WhyChooseUs />
        <BeforeAfter />
        <Reviews />
        <Team />
        <Pricing />
      </Layout>
      <ChatBot />
    </>
  );
}

export default App;



