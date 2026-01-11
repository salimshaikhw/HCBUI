import AppointmentPage from "./pages/AppointmentPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Header />
      <div style={{ flex: 1, overflow: "auto" }}>
        <AppointmentPage />
      </div>
      <Footer />
    </div>
  );
}

export default App;
