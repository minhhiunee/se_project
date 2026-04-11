import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="content-container">
          <AppRoutes />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
