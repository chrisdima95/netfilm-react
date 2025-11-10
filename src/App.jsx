import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import HomeWrapper from './components/HomeWrapper';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';
import { LoginModalProvider } from './context/LoginModalContext';

import ListaTodos from './pages/ListaTodos';
import Profilo from './pages/Profilo';
import Preferiti from './pages/Preferiti';
import FilmDetail from './pages/FilmDetail';

export default function App() {
  return (
    <BrowserRouter>
      <LoginModalProvider>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<HomeWrapper />}>
            <Route
              path="film/:id"
              element={
                <ProtectedRoute>
                  <FilmDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="todos"
              element={<Layout />}
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <ListaTodos />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="profilo"
              element={<Layout />}
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Profilo />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="preferiti"
              element={<Layout />}
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Preferiti />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<h1 style={{ padding: 24, color: '#fff' }}>404 - Pagina non trovata</h1>} />
        </Routes>
      </LoginModalProvider>
    </BrowserRouter>
  );
}
