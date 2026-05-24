import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import BeforeAfter from './components/BeforeAfter';
import Reviews from './components/Reviews';
import Team from './components/Team';

function App() {
  return (
    <Layout>
      <Hero />
      <Services />
      <WhyChooseUs />
      <BeforeAfter />
      <Reviews />
      <Team />
    </Layout>
  );
}

export default App;

