import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Navbar } from './components/layout/Navbar';

function App() {
  return (

        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<div>Home Page</div>} />
            </Routes>
          </div>
        </Router>

  );
}

export default App;