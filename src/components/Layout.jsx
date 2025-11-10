import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <div className="app-content-wrapper">
        <Navbar />
        
        <div className="app-content">
          {/* Main Content */}
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

