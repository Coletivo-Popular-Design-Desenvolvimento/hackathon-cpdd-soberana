<template>
  <div id="app">
    <header class="header">
      <h1>🌍 INTERNACIONAL</h1>
      <p class="subtitle">Mapa das Lutas da Classe Trabalhadora</p>
    </header>

    <main class="main-content">
      <div class="container">
        <div class="map-section">
          <MapComponent />
        </div>
        
        <div class="sidebar">
          <div class="sidebar-content">
            <h3>📋 Lutas Cadastradas</h3>
            <div class="lutas-list">
              <div 
                v-for="luta in lutas" 
                :key="luta.id" 
                class="luta-item"
              >
                <strong>{{ luta.titulo }}</strong>
                <p>{{ luta.localizacao }}</p>
                <small>Tipo: {{ luta.tipo }}</small>
              </div>
              <div v-if="lutas.length === 0" class="empty-state">
                Nenhuma luta cadastrada ainda
              </div>
            </div>

            <div class="add-luta-section">
              <h3>📝 Adicionar Nova Luta</h3>
              <p>Em breve: formulário para cadastrar novas lutas</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useLutasStore } from './stores/lutas'
import MapComponent from './components/MapComponent.vue'

export default {
  name: 'App',
  components: {
    MapComponent
  },
  setup() {
    const lutasStore = useLutasStore()

    onMounted(() => {
      console.log('🚀 INTERNACIONAL - Aplicação carregada!')
      lutasStore.fetchLutas()
    })

    return {
      lutas: computed(() => lutasStore.lutas),
      loading: computed(() => lutasStore.loading),
      error: computed(() => lutasStore.error)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background: #f5f5f5 !important;
  color: #333 !important;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #d32f2f;
  color: white;
  padding: 15px 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.header h1 {
  margin-bottom: 8px;
  font-size: 1.8em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 0.9em;
  opacity: 0.9;
}

.main-content {
  flex: 1;
  padding: 15px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  height: 100%;
}

.map-section {
  grid-column: 1;
}

.sidebar {
  grid-column: 2;
}

.sidebar-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
}

.sidebar-content h3 {
  color: #d32f2f;
  margin-bottom: 15px;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 5px;
}

.lutas-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.luta-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 10px;
  background: #fafafa;
}

.luta-item strong {
  color: #d32f2f;
  display: block;
  margin-bottom: 5px;
}

.luta-item p {
  margin: 5px 0;
  font-size: 0.9em;
  color: #666;
}

.luta-item small {
  color: #888;
  font-size: 0.8em;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
}

.add-luta-section {
  border-top: 2px dashed #ccc;
  padding-top: 20px;
}

.add-luta-section p {
  color: #666;
  font-style: italic;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .header {
    padding: 18px 20px;
  }
  
  .header h1 {
    font-size: 2.2em;
    margin-bottom: 10px;
  }
  
  .subtitle {
    font-size: 1.1em;
  }
  
  .main-content {
    padding: 20px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .header {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 2.5em;
  }
  
  .subtitle {
    font-size: 1.2em;
  }
}

/* Mobile (até 768px) */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .map-section {
    grid-column: 1;
  }
  
  .sidebar {
    grid-column: 1;
  }
}

/* Mobile muito pequeno (até 360px) */
@media (max-width: 360px) {
  .header h1 {
    font-size: 1.6em;
  }
  
  .subtitle {
    font-size: 0.8em;
  }
  
  .main-content {
    padding: 10px;
  }
  
  .sidebar-content {
    padding: 15px;
  }
}
</style>