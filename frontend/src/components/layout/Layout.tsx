// components/layout/Layout.tsx — under 40 lines
import { ReactNode } from "react";
import Starfield from "../starfield/Starfield";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", color: "#f0f0f5" }}>
      <Starfield />
      <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
    </div>
  );
}