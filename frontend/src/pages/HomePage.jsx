import Caminata from "../components/Caminata";
import FondoArtistico from "../components/FondoArtistico";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ObrasList from "../components/ObrasList";
import ProductosList from "../components/ProductosList";
import SobreSara from "../components/SobreSara";
import TalleresList from "../components/TalleresList";

// landing publica: una sola pagina con todas las secciones, en el mismo orden que los links de la navbar
// la navbar y el footer viven aca y no en App porque el login y el panel no los usan
function HomePage() {
  return (
    <FondoArtistico>
      <Navbar />
      <main>
        <Hero />
        <ObrasList />
        <ProductosList />
        <TalleresList />
        <Caminata />
        <SobreSara />
      </main>
      <Footer />
    </FondoArtistico>
  );
}

export default HomePage;
