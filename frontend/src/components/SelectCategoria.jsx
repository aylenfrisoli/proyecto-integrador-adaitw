import estilos from "../styles/admin.module.css";

// select para elegir la categoria de una obra o un producto; valor es el id de la categoria elegida
function SelectCategoria({ valor, onChange, categorias }) {
  return (
    <label className={estilos.campo}>
      Categoría
      <select
        value={valor}
        onChange={(evento) => onChange(evento.target.value)}
        required
      >
        {/* opcion vacia y deshabilitada: obliga a elegir una de verdad y no deja guardar con la primera por descuido */}
        <option value="" disabled>
          Elegí una categoría
        </option>
        {categorias.map((categoria) => (
          <option key={categoria._id} value={categoria._id}>
            {categoria.nombre}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SelectCategoria;
