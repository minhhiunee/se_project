import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content-container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
