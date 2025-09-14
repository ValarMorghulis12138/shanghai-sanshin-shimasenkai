import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import SessionsPage from './pages/SessionsPage';
import ContactPage from './pages/ContactPage';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <I18nProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </I18nProvider>
  );
}

export default App
