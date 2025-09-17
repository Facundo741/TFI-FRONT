import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import CategoriesSection from '../components/sections/CategoriesSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <div id="categorias">
        <CategoriesSection />
      </div>
    </>
  );
};

export default HomePage;
