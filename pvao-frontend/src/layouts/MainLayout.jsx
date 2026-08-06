//This is likely the standard frame used for regular pages (like your Landing page or Credits page). It probably includes your main top Navbar and the bottom Footer.
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import ModuleSubNav from '../components/common/ModuleSubNav/ModuleSubNav';
import Footer from '../components/common/Footer/Footer';
import AstroCopilot from '../components/common/AstroCopilot';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <ModuleSubNav />
      <main style={{ minHeight: '100vh', paddingTop: '112px' }}>
        <Outlet />
      </main>
      <Footer />
      <AstroCopilot />
    </>
  );
};

export default MainLayout;
