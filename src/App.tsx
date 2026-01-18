import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import SignalBasics from './pages/SignalBasics';
import TransmissionModes from './pages/TransmissionModes';

const Home = () => (
  <div className="glass-panel" style={{ padding: '2rem' }}>
    <h1>Welcome to Data Comm Sim</h1>
    <p>Select a module from the sidebar to begin your journey into data communication.</p>
  </div>
);

const Placeholder = () => (
  <div className="glass-panel flex-center" style={{ padding: '3rem', flexDirection: 'column' }}>
    <h2>🚧 Module Under Construction</h2>
    <p>This simulation module is coming soon.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="signal-basics" element={<SignalBasics />} />
          <Route path="transmission" element={<TransmissionModes />} />
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
