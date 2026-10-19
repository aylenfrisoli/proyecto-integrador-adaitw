import Footer from "../components/Footer";
import Grano from "../components/Grano";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Navbar from "../components/Navbar";
import ObrasList from "../components/ObrasList";
import ProductosList from "../components/ProductosList";
import SobreSara from "../components/SobreSara";
import TalleresList from "../components/TalleresList";
import styles from "./HomePage.module.css";

// landing publica: una sola pagina con todas las secciones, en el mismo orden que los links de la navbar
// la navbar y el footer viven aca y no en App porque el login y el panel no los usan
function HomePage() {
  return (
    <div className={styles.pagina}>
      <Grano />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ProductosList />
        <TalleresList />
        <ObrasList />
        <SobreSara />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
