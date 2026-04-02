import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { Layout } from './components';
import { Home, Login, Dashboard, Attendance } from './pages';
import './styles/globals.css';

/**
 * Main App component with routing
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;