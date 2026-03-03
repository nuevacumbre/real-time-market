# 📈 Real-Time Market

Una plataforma educativa de trading que combina datos del mercado en tiempo real con un blog de noticias financieras. Desarrollada con Vue 3, Firebase y Bootstrap.

<div align="center">

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)

</div>

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración de Firebase](#-configuración-de-firebase)
- [Uso](#-uso)
- [Pruebas](#-pruebas)
- [Despliegue](#-despliegue)
- [Autor](#-autor)

## 🎯 Características

- ✅ **Autenticación de Usuarios** - Registro e inicio de sesión con Firebase Auth
- ✅ **Datos de Mercado en Tiempo Real** - Conexión a Yahoo Finance API
- ✅ **Blog de Noticias** - Sistema completo de noticias con comentarios
- ✅ **Portafolio de Usuario** - Simulador de compra/venta de activos
- ✅ **Historial de Navegación** - Seguimiento de últimas noticias vistas
- ✅ **Diseño Responsive** - Interfaz adaptable con Bootstrap 5
- ✅ **Seguridad** - Sanitización de inputs con DOMPurify
- ✅ **Pruebas Unitarias** - Tests con Vitest y Vue Test Utils

## 🛠️ Tecnologías

### Frontend

- **Vue 3** - Framework progresivo con Composition API
- **Vue Router** - Enrutamiento y protección de rutas
- **Pinia** - Store de estado global
- **Bootstrap 5** - Framework CSS para UI responsive
- **Chart.js** - Gráficos interactivos para datos históricos
- **DOMPurify** - Sanitización de inputs

### Backend & Servicios

- **Firebase Authentication** - Gestión de usuarios
- **Firestore** - Base de datos para noticias y comentarios
- **Yahoo Finance API** - Datos de mercado en tiempo real

### Desarrollo

- **Vite** - Build tool y servidor de desarrollo
- **Vitest** - Framework de pruebas unitarias
- **ESLint** - Linting y calidad de código

## 📁 Estructura del Proyecto

# real-time-market

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
