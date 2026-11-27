# Zora Guardian — Landing page

Landing page responsive para presentar Zora Guardian, un concepto de monitoreo inteligente del nivel de agua en cisternas y tanques.

## Contenido
- `index.html`: estructura y contenido de la landing.
- `styles.css`: diseño visual responsive.
- `script.js`: navegación móvil, simulador de nivel y formulario demostrativo.
- `assets/`: imágenes de referencia y renders conceptuales.

## Ejecutar localmente
No requiere instalación de dependencias. Abre `index.html` en un navegador o usa una extensión como Live Server en Visual Studio Code.

También puedes iniciar un servidor local desde esta carpeta:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Publicar en GitHub

1. Crea un repositorio vacío en GitHub, por ejemplo `zora-guardian-landing`.
2. En la terminal, dentro de esta carpeta, ejecuta:

```bash
git init
git add .
git commit -m "Initial Zora Guardian landing page"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/zora-guardian-landing.git
git push -u origin main
```

Sustituye `TU-USUARIO` por tu usuario de GitHub y ajusta la URL al repositorio creado.

## Publicar con GitHub Pages
1. En GitHub abre **Settings → Pages**.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Selecciona `main` y la carpeta `/ (root)`.
4. Guarda. GitHub Pages publicará el sitio en unos minutos.

## Antes de publicar comercialmente
- Sustituye las imágenes conceptuales por fotografías o renders aprobados del producto final.
- Confirma la ficha técnica, materiales, conectividad, alimentación y grados IP.
- Configura el formulario de contacto con un backend, CRM o servicio de formularios. Actualmente es una demostración visual y no envía datos.
- Actualiza textos, datos de contacto y enlaces comerciales.
- Los valores del simulador (capacidad de 10,000 L y umbrales de alerta) son ilustrativos y configurables.
