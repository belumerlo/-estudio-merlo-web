# Estudio Merlo · sitio web

Sitio estático (HTML, CSS y JavaScript, sin dependencias). Se publica en Cloudflare Pages.

## Estructura

```
index.html          Página principal
styles.css          Estilos
app.js              Animaciones, calculadora y armado de misiones y jugadores
favicon.svg         Ícono de la pestaña
datos/misiones.js   <- Misiones (editá acá)
datos/jugadores.js  <- Jugadores (editá acá)
img/                Fotos (crear cuando haga falta)
```

## Editar contenido

- **Misiones**: abrí `datos/misiones.js`, copiá un bloque `{ ... }` y cambiá los textos.
  `estado` puede ser `'cumplida'` o `'en curso'`.
- **Jugadores**: abrí `datos/jugadores.js` y hacé lo mismo.
  Para la foto, subí la imagen a `img/` y poné la ruta en `foto`, por ejemplo `'img/belu.jpg'`.

Ojo con las comas: cada bloque termina en `}` y, si viene otro después, lleva una coma `},`.

Al guardar los cambios en GitHub, Cloudflare publica la nueva versión sola en uno o dos minutos.

## Probar en tu compu

Abrí `index.html` con doble clic en el navegador. No hace falta instalar nada.
