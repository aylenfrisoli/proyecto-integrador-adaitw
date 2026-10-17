import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// componente raiz: arma navbar + contenido + footer; el contenido es un placeholder hasta armar la landing
function App() {
  return (
    <>
      <Navbar />
      <main id="inicio" className="container">
        <h1 className="display-title">SAF Creaciones para Vos</h1>
      </main>
      <Footer />
    </>
  );
}

export default App;
