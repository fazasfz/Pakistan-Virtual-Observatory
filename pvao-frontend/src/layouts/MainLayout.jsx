import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import AstroCopilot from '../components/common/AstroCopilot';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
        <Outlet />
      </main>
      <Footer />
      <AstroCopilot />
    </>
  );
};

export default MainLayout;
