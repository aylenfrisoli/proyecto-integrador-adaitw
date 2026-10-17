import Hero from "../components/Hero";
import ObrasList from "../components/ObrasList";
import ProductosList from "../components/ProductosList";
import SobreSara from "../components/SobreSara";
import TalleresList from "../components/TalleresList";

// landing publica: una sola pagina con todas las secciones, en el mismo orden que los links de la navbar
function HomePage() {
  return (
    <main>
      <Hero />
      <ObrasList />
      <ProductosList />
      <TalleresList />
      <SobreSara />
    </main>
  );
}

export default HomePage;
