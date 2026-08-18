/**
 * Primary layout shell for standard pages (e.g., Landing, Credits).
 * Includes the global Navbar, Footer, and AstroCopilot widget.
 */
//This is likely the standard frame used for regular pages (like your Landing page or Credits page). It probably includes your main top Navbar and the bottom Footer.
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import AstroCopilot from '../components/common/AstroCopilot';
import { AstroCopilotProvider } from '../context/AstroCopilotContext';

const MainLayout = () => {
  return (
    <AstroCopilotProvider>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
        <Outlet />
      </main>
      <Footer />
      <AstroCopilot />
    </AstroCopilotProvider>
  );
};

export default MainLayout;
