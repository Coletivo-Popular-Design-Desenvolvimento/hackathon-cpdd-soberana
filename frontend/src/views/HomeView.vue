<template>
  <div class="home">
    <header class="header">
      <h1>🌍 INTERNACIONAL</h1>
      <p class="subtitle">Mapa das Lutas da Classe Trabalhadora</p>
    </header>

    <div class="container">
      <div class="map-section">
        <MapComponent />
      </div>
      
      <div class="sidebar">
        <LutaList />
        <AddLutaForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useLutasStore } from '@/stores/lutas';
import MapComponent from '@/components/MapComponent.vue';
import LutaList from '@/components/LutaList.vue';
import AddLutaForm from '@/components/AddLutaForm.vue';

const lutasStore = useLutasStore();

onMounted(() => {
  lutasStore.fetchLutas();
});
</script>

<style scoped>
.home {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  background: #d32f2f;
  color: white;
  padding: 20px;
  border-radius: 8px;
}

.header h1 {
  margin: 0;
  font-size: 2.5em;
}

.subtitle {
  margin: 10px 0 0 0;
  font-size: 1.2em;
  opacity: 0.9;
}

.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.map-section {
  grid-column: 1;
}

.sidebar {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    grid-column: 1;
  }
}
</style>