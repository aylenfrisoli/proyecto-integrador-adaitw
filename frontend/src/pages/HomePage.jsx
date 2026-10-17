import Hero from "../components/Hero";
import SobreSara from "../components/SobreSara";

// landing publica: una sola pagina con todas las secciones; las demas se suman en los proximos pasos
function HomePage() {
  return (
    <main>
      <Hero />
      <SobreSara />
    </main>
  );
}

export default HomePage;
