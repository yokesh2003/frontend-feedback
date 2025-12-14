import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import backgroundImage from './assets/background.png';
import FeedbackForm from './components/FeedbackForm';
import FeedbackTable from './components/FeedbackTable';
import Home from './components/Home';

function App() {

  const [reload, setReload] = useState(false);

  return (
    <BrowserRouter>
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light overlay
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
            <div className="container-fluid">
              <Link className="navbar-brand fw-bold" to="/">FeedbackHub</Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/feedback">Feedback</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container-fluid">
            <Routes>
              <Route path="/" element={
                <div className="row justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                  <div className="col-12">
                    <Home />
                  </div>
                </div>
              } />
              <Route path="/feedback" element={
                <div className="row justify-content-center">
                  <div className="col-12 d-flex justify-content-center">
                    <FeedbackForm onSuccess={() => setReload(!reload)} />
                  </div>
                </div>
              } />
              <Route path="/admin" element={<FeedbackTable reload={reload} />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
