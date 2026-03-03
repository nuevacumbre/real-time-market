<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="bg-dark text-white mt-5 py-4">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>📈 Real-Time Market</h5>
          <p>Plataforma educativa de trading con datos en tiempo real y análisis de mercado.</p>
        </div>
        <div class="col-md-4">
          <h5>Enlaces Rápidos</h5>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-white-50">Inicio</router-link></li>
            <li><router-link to="/market" class="text-white-50">Mercado</router-link></li>
            <li><router-link to="/news" class="text-white-50">Noticias</router-link></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h5>Contacto</h5>
          <p>
            Email: info@realmarket.com<br />
            Tel: +56 9 1234 5678<br />
            Santiago, Chile
          </p>
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="text-center">
        <p class="mb-0">&copy; 2026 Real-Time Market. Todos los derechos reservados.</p>
        <small class="text-white-50">Desarrollado por Christopher Espinoza</small>
      </div>
    </div>
  </footer>
</template>
