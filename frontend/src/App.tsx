import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/utils/ProtectedRoute';
import { HomeScreen } from './screens/Home/HomeScreen';
import { LoginScreen } from './screens/Auth/LoginScreen';
import { RegisterScreen } from './screens/Auth/RegisterScreen';
import { DashboardScreen } from './screens/Dashboard/DashboardScreen';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

