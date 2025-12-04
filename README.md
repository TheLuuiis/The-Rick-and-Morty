# The Rick and Morty — Web Cards

<h3>Link de la web (GitHub Page): https://theluuiis.github.io/The-Rick-and-Morty/</h3>

Proyecto web que consume la API pública de Rick and Morty para mostrar tarjetas de personajes con datos clave. Incluye tema claro/oscuro con transición suave y paginación manual entre páginas, todo en HTML/CSS/JS sin frameworks.

**Demo local**: abre `index.html` en tu navegador o sirve la carpeta.

## Características
- **Consumo de API**: obtiene personajes, muestra nombre, estado, imagen, última localización y primer episodio.
- **Paginación manual**: botones en el contenedor `.pages` para cargar páginas (1 y 2) sin recargar la web.
- **Tema claro/oscuro**: alterna con un botón; persiste en `localStorage` y respeta `prefers-color-scheme` del sistema.
- **Transiciones suaves**: animaciones de color/borde/sombra gracias a las transiciones globales.
- **Tarjetas con imagen recortada**: `figure` aplica `border-radius` y recorta el contenido con `overflow: hidden` + `object-fit: cover`.

## Estructura del proyecto

- `index.html`: estructura del DOM, header con logo y botón de tema (dos SVG: `#light` y `#dark`), contenedor principal y tarjetas base. Contiene también el contenedor `.pages` para los botones de paginación.
- `styles.css`: estilos del sitio (layout, tarjetas, tipografía). Al final se añaden reglas de tema claro/oscuro mediante variables CSS y selectores de `data-theme` (sin modificar reglas previas).
- `index.js`: lógica de la aplicación:
	- Gestión del tema (aplicar, alternar, persistir, seguir preferencia del sistema).
	- Carga de personajes desde la API.
	- Paginación: función `loadPage(page)` y listeners para los enlaces de `.pages`.

## Arquitectura y decisiones
- **Vanilla JS**: se evita complejidad innecesaria; se manipulan nodos existentes mediante `querySelectorAll`.
- **Tematización con CSS Variables**: se definen variables por defecto y se sobreescriben bajo `[data-theme="dark"]`, lo que permite alternar tema sin duplicar estilos.
- **Accesibilidad básica**: el enlace de página activo usa `aria-current="page"` para marcar la selección.
- **Rendimiento**: se realiza un fetch por página y un fetch adicional por primer episodio de cada personaje mostrado.

## Instalación y ejecución

En Windows (PowerShell):

```powershell
# Abrir directamente en el navegador (local)
start .\index.html

# Opcional: servir con un servidor estático si tienes Node.js
npx serve .
```

No requiere dependencias ni build: es HTML/CSS/JS puro.

## Uso
1. Abre la página. Se cargará la **página 1** de personajes por defecto.
2. Usa los botones dentro de `.pages` (por ejemplo, "1" y "2") para cambiar de página. El contenido se actualiza en el mismo lugar.
3. Alterna el tema con el botón del header. Los íconos `#light` y `#dark` se muestran/ocultan según el tema activo.
4. El tema elegido se guarda en `localStorage` y se restaura al volver a abrir la web.

## Detalle técnico del tema oscuro
- Se establece `data-theme="dark"` o `data-theme="light"` en el elemento `<html>`.
- CSS define variables base en `:root` y overrides en `[data-theme="dark"]` para: fondo (`--bg`), texto (`--text`), bordes (`--border`), tonos atenuados (`--muted`), fondo de tarjeta (`--cardBg`) y sombra (`--cardShadow`).
- `html { color-scheme: light dark; }` permite que elementos nativos adopten el esquema.
- Los dos SVG del botón alternan visibilidad únicamente con CSS:
	- `:root #light { display: none; }`
	- `:root #dark { display: block; }`
	- `[data-theme="dark"] #light { display: block; }`
	- `[data-theme="dark"] #dark { display: none; }`
- Transición suave: ya existe una regla global `* { transition: ... }` que incluye color, fondo, borde y sombra.

## Detalle técnico de paginación
- Los enlaces dentro de `.pages a` interceptan el click (`preventDefault`) y llaman a `loadPage(pageNum)`.
- `loadPage(page)` solicita `https://rickandmortyapi.com/api/character?page=${page}` y rellena las tarjetas visibles.
- Si la página trae menos resultados que tarjetas disponibles, se limpian las tarjetas sobrantes para evitar mostrar datos antiguos.
- El enlace activo se marca con `aria-current="page"`; en CSS puede estilizarse:

```css
.pages a[aria-current="page"] {
	background-color: var(--border);
	color: var(--bg);
}
```

## API utilizada
- Endpoint: `https://rickandmortyapi.com/api/character`
- Paginación: parámetro `page` (`?page=1`, `?page=2`, ...).
- Campos usados por tarjeta:
	- `name`, `status`, `image`, `location.name`.
	- Primer episodio: `episode[0]` (se hace un fetch adicional del recurso para obtener su `name`).

## Estilos clave para imágenes recortadas
- En `styles.css` se añadió:
	- `overflow: hidden` al `figure` dentro de `.card` para que el `border-radius` recorte el contenido.
	- Reglas para la imagen: `object-fit: cover`, `width: 100%`, `height: 100%`, `display: block`.

## Personalización
- **Colores**: ajusta variables en `:root` y `[data-theme="dark"]`.
- **Sombras y bordes**: modifica `--cardShadow` y `--border` para cambiar contraste.
- **Cantidad de tarjetas**: amplía el markup en `index.html` y el bucle en `index.js` se adaptará automáticamente (rellena hasta el número de nodos presentes).
- **Más páginas**: agrega más enlaces dentro de `.pages` y los listeners funcionarán igual.

## Pruebas rápidas
- Verifica la alternancia de tema: cambia el sistema a claro/oscuro y recarga; sin elección previa debería seguir el sistema.
- Pulsa el botón de tema: confirma que persiste tras cerrar y reabrir.
- Paginación: pulsa "2" y corroboro que las tarjetas cambian; vuelve a "1".
- Contraste: en oscuro, revisa legibilidad de textos y enlaces.

## Roadmap sugerido
- Búsqueda y filtrado por nombre/estado.
- Botones Prev/Next y total de páginas.
- Skeleton loaders mientras se obtienen datos.
- Manejo de errores visible (toast o banner) cuando la API falla.
- Mejoras de accesibilidad (roles, focus states, descripciones ARIA).

## Créditos
- API: Rick and Morty API — https://rickandmortyapi.com/
- Tipografía: Onest (Google Fonts)
- Íconos: SVG embebidos en `index.html`
