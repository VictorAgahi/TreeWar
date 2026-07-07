import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/utils/ProtectedRoute';
import { LandingScreen } from './screens/Landing/LandingScreen';
import { LoginScreen } from './screens/Auth/LoginScreen';
import { RegisterScreen } from './screens/Auth/RegisterScreen';
import { MainLayout } from './components/templates/MainLayout/MainLayout';
import { MapPage } from './pages/MapPage/MapPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          <Route element={<MainLayout />}>
            <Route path="map" element={<MapPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
