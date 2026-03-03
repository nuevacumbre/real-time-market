<template>
  <div class="card mb-3 shadow-sm">
    <div class="row g-0">
      <div class="col-md-4">
        <img
          :src="news.imageUrl || 'https://via.placeholder.com/300x200'"
          class="img-fluid rounded-start h-100 object-fit-cover"
          :alt="news.title"
        />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge" :class="getCategoryBadge(news.category)">{{ news.category }}</span>
            <small class="text-muted">{{ formatDate(news.publishedAt) }}</small>
          </div>

          <h5 class="card-title">{{ news.title }}</h5>
          <p class="card-text">{{ news.summary }}</p>

          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
              <i class="bi bi-person-circle"></i> {{ news.author || 'Autor Desconocido' }}
            </small>
            <router-link :to="`/news/${news.id}`" class="btn btn-primary btn-sm">
              Leer más <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  news: {
    type: Object,
    required: true,
  },
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getCategoryBadge = (category) => {
  const badges = {
    Mercados: 'bg-success',
    Tecnología: 'bg-primary',
    Economía: 'bg-warning text-dark',
    Política: 'bg-danger',
    Empresas: 'bg-info text-dark',
  }
  return badges[category] || 'bg-secondary'
}
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
