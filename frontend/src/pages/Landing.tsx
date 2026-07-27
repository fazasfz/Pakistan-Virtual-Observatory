// pages/Landing.tsx — under 40 lines
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

const { Title, Paragraph } = Typography;

export default function Landing() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <Title style={{ color: "#f0f0f5" }}>Pakistan Virtual Astronomy Observatory</Title>
        <Paragraph style={{ color: "#c0c0d0" }}>Step into the sky above Pakistan.</Paragraph>
        <Button type="primary" size="large" onClick={() => navigate("/night-sky")}>Start Exploring</Button>
      </div>
    </Layout>
  );
}