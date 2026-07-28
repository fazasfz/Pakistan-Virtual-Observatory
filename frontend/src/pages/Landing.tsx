import { Typography, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Satellite, Sun, Orbit, Star, Rocket, Bot } from "lucide-react";
import Layout from "../components/layout/Layout";
import "./Landing.css";

const { Title, Paragraph } = Typography;

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleNavigate = (path: string) => {
    if (path === "/night-sky") {
      navigate(path);
    } else {
      message.info({
        content: "Sector Under Observation — Module Initializing. Coming Soon!",
        className: "custom-toast",
        style: { marginTop: "10vh" },
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <Layout>
      <div className="landing-container">
        {/* Animated Background */}
        <div className="stars-bg">
          <motion.div className="star-layer" style={{ y: yBg }}></motion.div>
          <div className="nebula-glow"></div>
          <div className="nebula-glow-2"></div>
        </div>

        {/* Hero Chapter */}
        <motion.div 
          className="cosmic-section" 
          style={{ opacity: opacityHero }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ textAlign: "center", zIndex: 10 }}
          >
            <div className="hero-organization">
              National Center of GIS & Space Applications (NCGSA) & Institute of Space Technology (IST)
            </div>
            <h1 className="hero-title">Pakistan Virtual Observatory</h1>
            <p className="hero-subtitle">
              Pakistan's primary digital portal for real-time sky observation, solar monitoring, satellite tracking, and deep-space exploration.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="primary" 
                size="large" 
                style={{ marginTop: "2rem", height: "50px", padding: "0 40px", fontSize: "1.2rem", background: "#38bdf8", border: "none" }}
                onClick={() => {
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }}
              >
                Begin Cosmic Voyage
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Sector 01: Earth & Atmosphere */}
        <motion.div 
          className="cosmic-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="section-header">
            <h2 className="section-title">Sector 01</h2>
            <div className="section-subtitle">Earth & Atmosphere</div>
          </div>
          <div className="module-grid">
            <div className="glass-card glow-cyan" onClick={() => handleNavigate('/night-sky')}>
              <div className="card-title">
                <Star color="#38bdf8" /> Night Sky Portal
              </div>
              <div className="card-desc">
                Observe real-time celestial coordinates and interactive star maps tuned to local positions across Pakistan.
              </div>
              <Button className="cta-button" size="large">Launch Sky Map</Button>
            </div>
            
            <div className="glass-card glow-cyan" onClick={() => handleNavigate('/earth-view')}>
              <div className="card-title">
                <Globe color="#38bdf8" /> Earth View
              </div>
              <div className="card-desc">
                Visualize real-time global day/night terminators and light pollution layers.
              </div>
              <Button className="cta-button" size="large">Explore Earth View</Button>
            </div>

            <div className="glass-card glow-cyan" onClick={() => handleNavigate('/satellite-tracker')}>
              <div className="card-title">
                <Satellite color="#38bdf8" /> Satellite Tracker
              </div>
              <div className="card-desc">
                Track active ISS trajectories and orbital satellite ground passes live.
              </div>
              <Button className="cta-button" size="large">Track Satellites</Button>
            </div>
          </div>
        </motion.div>

        {/* Sector 02: Helios & Planets */}
        <motion.div 
          className="cosmic-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="section-header">
            <h2 className="section-title">Sector 02</h2>
            <div className="section-subtitle">Helios & Planets</div>
          </div>
          <div className="module-grid" style={{ maxWidth: "800px" }}>
            <div className="glass-card glow-amber" onClick={() => handleNavigate('/solar-system')}>
              <div className="card-title">
                <Orbit color="#f59e0b" /> Solar System Simulator
              </div>
              <div className="card-desc">
                Step into an interactive, to-scale 3D orbital simulation of the planetary system.
              </div>
              <Button className="cta-button" size="large">Enter Simulator</Button>
            </div>
            
            <div className="glass-card glow-amber" onClick={() => handleNavigate('/solar-observatory')}>
              <div className="card-title">
                <Sun color="#f59e0b" /> Solar Observatory
              </div>
              <div className="card-desc">
                Inspect live solar imagery, H-alpha phenomena, and real-time space weather data.
              </div>
              <Button className="cta-button" size="large">Observe Sun</Button>
            </div>
          </div>
        </motion.div>

        {/* Sector 03: Deep Cosmos & Exoplanets */}
        <motion.div 
          className="cosmic-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="section-header">
            <h2 className="section-title">Sector 03</h2>
            <div className="section-subtitle">Deep Cosmos & Exoplanets</div>
          </div>
          <div className="module-grid" style={{ maxWidth: "800px" }}>
            <div className="glass-card glow-violet" onClick={() => handleNavigate('/exovista')}>
              <div className="card-title">
                <Globe color="#c084fc" /> ExoVista
              </div>
              <div className="card-desc">
                Analyze and compare exoplanets by mass, stellar distance, and atmospheric habitability.
              </div>
              <Button className="cta-button" size="large">Compare Exoplanets</Button>
            </div>
            
            <div className="glass-card glow-violet" onClick={() => handleNavigate('/deep-sky')}>
              <div className="card-title">
                <Rocket color="#c084fc" /> Deep Sky Explorer
              </div>
              <div className="card-desc">
                Search and filter through the complete catalog of Messier and NGC deep-sky objects.
              </div>
              <Button className="cta-button" size="large">Explore Deep Sky</Button>
            </div>
          </div>
        </motion.div>

        {/* Sector 04: Intelligence Core */}
        <motion.div 
          className="cosmic-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="section-header">
            <h2 className="section-title">Sector 04</h2>
            <div className="section-subtitle">Intelligence Core</div>
          </div>
          <div className="module-grid" style={{ maxWidth: "400px" }}>
            <div className="glass-card glow-cyan" style={{ borderColor: "rgba(56,189,248,0.5)" }} onClick={() => handleNavigate('/astro-copilot')}>
              <div className="card-title" style={{ justifyContent: "center" }}>
                <Bot color="#38bdf8" /> Astro CoPilot
              </div>
              <div className="card-desc" style={{ textAlign: "center" }}>
                Query astrophysics datasets, orbital math, and observational parameters with our specialized AI assistant.
              </div>
              <Button className="cta-button" size="large">Launch CoPilot</Button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="footer">
          <p>Pakistan Virtual Observatory (PVO) · Operated under NCGSA & Institute of Space Technology (IST)</p>
          <p style={{ marginTop: "8px", fontSize: "0.9rem", opacity: 0.7 }}>Public Astronomy & Space Applications Initiative</p>
        </footer>
      </div>
    </Layout>
  );
}