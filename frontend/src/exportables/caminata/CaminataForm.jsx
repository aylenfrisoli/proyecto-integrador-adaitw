import { useState } from "react";
import CampoImagen from "../../components/CampoImagen";
import estilos from "../../styles/admin.module.css";
import { MAX_FOTOS, diaDesdeInput, diaParaInput } from "../../utils/caminata";

// cada fila de foto necesita un id propio y estable para usarlo de key
// el indice no sirve: al quitar una fila del medio las demas cambiarian de key y react mezclaria sus datos
let ultimoIdFoto = 0;

// arma una fila del formulario, vacia o a partir de una foto que ya existe
function crearFilaFoto(foto) {
  ultimoIdFoto += 1;
  return { id: ultimoIdFoto, url: foto?.url ?? "", epigrafe: foto?.epigrafe ?? "" };
}

// formulario de una edicion de la caminata: sirve para crear (caminata = null) y para editar (caminata con datos)
function CaminataForm({ caminata, enviando, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(caminata?.nombre ?? "");
  const [fecha, setFecha] = useState(caminata ? diaParaInput(caminata.fecha) : "");
  const [lugar, setLugar] = useState(caminata?.lugar ?? "");
  const [descripcion, setDescripcion] = useState(caminata?.descripcion ?? "");
  // se pasa una funcion para que las filas y sus ids se armen una sola vez y no en cada render
  const [fotos, setFotos] = useState(() => (caminata?.fotos ?? []).map(crearFilaFoto));

  function agregarFoto() {
    setFotos([...fotos, crearFilaFoto()]);
  }

  // cambia un solo campo de una foto sin tocar las demas: map arma un array nuevo y no se modifica el estado
  function cambiarFoto(id, cambios) {
    setFotos(fotos.map((foto) => (foto.id === id ? { ...foto, ...cambios } : foto)));
  }

  function quitarFoto(id) {
    setFotos(fotos.filter((foto) => foto.id !== id));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onGuardar({
      nombre,
      // la api espera la fecha completa: se manda mediodia argentino para que el dia no se corra
      fecha: diaDesdeInput(fecha),
      lugar,
      descripcion,
      // se manda la lista entera, sin los ids de las filas que son solo del formulario
      // un epigrafe vacio no hace falta sacarlo: la api lo descarta
      fotos: fotos.map(({ url, epigrafe }) => ({ url, epigrafe })),
    });
  }

  return (
    <form onSubmit={manejarEnvio} className={estilos.tarjetaForm}>
      <h3 className={estilos.tituloForm}>
        {caminata ? "Editar edición" : "Nueva edición"}
      </h3>

      <div className={estilos.formularioColumna}>
        <label className={estilos.campo}>
          Nombre de la edición
          <input
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            maxLength={60}
            placeholder="Ej: 1ª edición"
            required
          />
          <span className={estilos.pista}>
            Es lo que dice el botón de esta edición en el sitio.
          </span>
        </label>

        <label className={estilos.campo}>
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
            required
          />
        </label>

        <label className={estilos.campo}>
          Lugar
          <input
            type="text"
            value={lugar}
            onChange={(evento) => setLugar(evento.target.value)}
            maxLength={150}
            placeholder="Ej: Costanera, San Bernardo del Tuyú"
            required
          />
        </label>

        <label className={estilos.campo}>
          Descripción
          <textarea
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            maxLength={1000}
            required
          />
        </label>

        <fieldset className={estilos.grupoFotos}>
          <legend className={estilos.leyenda}>Fotos</legend>
          <p className={estilos.pista}>
            Pegá el link directo de cada foto (tiene que terminar en .jpg, .png o
            similar). Los links de Drive o Instagram no funcionan. En el sitio se
            muestran como polaroids, con el epígrafe debajo.
          </p>

          {fotos.length === 0 && (
            <p className={estilos.pista}>Todavía no agregaste ninguna foto.</p>
          )}

          <ul className={estilos.listaFotos}>
            {fotos.map((foto, indice) => (
              <li
                key={foto.id}
                className={`${estilos.formularioColumna} ${estilos.filaFoto}`}
              >
                <div className={estilos.encabezadoFoto}>
                  <span className={estilos.nombre}>Foto {indice + 1}</span>
                  <button
                    type="button"
                    className={`${estilos.botonChico} ${estilos.botonPeligro}`}
                    onClick={() => quitarFoto(foto.id)}
                    aria-label={`Quitar la foto ${indice + 1}`}
                  >
                    Quitar
                  </button>
                </div>

                <CampoImagen
                  etiqueta={`Foto ${indice + 1} (link)`}
                  valor={foto.url}
                  onChange={(url) => cambiarFoto(foto.id, { url })}
                  cuadrada
                  chica
                />

                <label className={estilos.campo}>
                  Epígrafe de la foto {indice + 1} (opcional)
                  <input
                    type="text"
                    value={foto.epigrafe}
                    onChange={(evento) =>
                      cambiarFoto(foto.id, { epigrafe: evento.target.value })
                    }
                    maxLength={120}
                    placeholder="Ej: Salida desde la costanera"
                  />
                </label>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`btn btn-outline ${estilos.agregarFoto}`}
            onClick={agregarFoto}
            disabled={fotos.length >= MAX_FOTOS}
          >
            Agregar foto
          </button>
          <p className={estilos.pista}>
            {fotos.length} de {MAX_FOTOS} fotos
          </p>
        </fieldset>
      </div>

      <div className={`${estilos.acciones} ${estilos.accionesForm}`}>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {caminata ? "Guardar cambios" : "Crear edición"}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default CaminataForm;
