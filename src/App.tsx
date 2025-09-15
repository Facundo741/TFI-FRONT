import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import CategoriesSection from './components/sections/CategoriesSection';

function App() {
  return (

        <Router>
          <div className="App">
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <CategoriesSection />
            <Routes>
              <Route path="/" />
            </Routes>
            <Footer />
          </div>
        </Router>

  );
}

export default App;