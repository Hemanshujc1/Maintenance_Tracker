import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EquipmentList from './pages/EquipmentList';
import EquipmentForm from './pages/EquipmentForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="nav-brand">Maintenance Tracker</Link>
          <div className="nav-links">
            <Link to="/equipment">Equipment</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<div className="home"><h1>Welcome to Maintenance Tracker</h1><Link to="/equipment">Manage Equipment</Link></div>} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/new" element={<EquipmentForm />} />
            <Route path="/equipment/:id" element={<EquipmentForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
