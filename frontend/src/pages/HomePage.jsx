import Hero from "../components/Hero";
import ObrasList from "../components/ObrasList";
import ProductosList from "../components/ProductosList";
import SobreSara from "../components/SobreSara";

// landing publica: una sola pagina con todas las secciones; las demas se suman en los proximos pasos
function HomePage() {
  return (
    <main>
      <Hero />
      <ObrasList />
      <ProductosList />
      <SobreSara />
    </main>
  );
}

export default HomePage;
