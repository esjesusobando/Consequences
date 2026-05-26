import React from "react";
import { Header } from "./Header";
import "./Layout.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">{children}</main>
    </div>
  );
};
