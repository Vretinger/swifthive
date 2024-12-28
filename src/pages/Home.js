import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureButtons from '../components/FeatureButtons';
import AboutIntro from '../components/AboutIntro';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeatureButtons />
      <AboutIntro />
    </div>
  );
};

export default Home;