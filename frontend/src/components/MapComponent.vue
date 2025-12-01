<template>
  <div class="map-container">
    <div v-if="loading" class="loading">
      🚩 Carregando mapa das lutas...
    </div>
    <div v-else-if="error" class="error">
      ❌ {{ error }}
    </div>
    <div v-else>
      <div id="map" class="map" ref="mapElement"></div>
      <div class="map-info">
        <p>🎯 <strong>{{ lutasCount }}</strong> lutas mapeadas</p>
        <p>📍 Clique nos marcadores para ver detalhes</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLutasStore } from '../stores/lutas'

const lutasStore = useLutasStore()
const mapElement = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let markers: L.Marker[] = []

const lutasCount = computed(() => lutasStore.lutas.length)
const loading = computed(() => lutasStore.loading)
const error = computed(() => lutasStore.error)

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

const updateMarkers = (): void => {
  markers.forEach(marker => {
    if (map) map.removeLayer(marker)
  })
  markers = []

  if (!map || lutasStore.lutas.length === 0) return

  lutasStore.lutas.forEach(luta => {
    if (luta.latitude && luta.longitude) {
      const marker = L.marker([luta.latitude, luta.longitude])
        .bindPopup(`
          <div class="popup-content">
            <h3>${luta.titulo}</h3>
            <p><strong>📍 Local:</strong> ${luta.localizacao}</p>
            <p><strong>🎯 Tipo:</strong> ${luta.tipo}</p>
            <p><strong>📝 Descrição:</strong> ${luta.descricao}</p>
            ${luta.necessidades ? `<p><strong>🆘 Necessidades:</strong> ${luta.necessidades}</p>` : ''}
            ${luta.contato ? `<p><strong>📞 Contato:</strong> ${luta.contato}</p>` : ''}
          </div>
        `)
        .addTo(map)
      
      markers.push(marker)
    }
  })

  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

const initializeMap = (): void => {
  if (!mapElement.value) return

  map = L.map(mapElement.value).setView([-14.2350, -51.9253], 4)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map)

  setTimeout(() => {
    if (map) {
      map.invalidateSize()
      updateMarkers()
    }
  }, 100)
}

onMounted(() => {
  initializeMap()
})

watch(() => lutasStore.lutas, () => {
  if (map) updateMarkers()
})

watch(() => lutasStore.loading, (newLoading) => {
  if (!newLoading && map) {
    setTimeout(() => {
      if (map) map.invalidateSize()
    }, 500)
  }
})
</script>

<style scoped>
.map-container {
  margin: 0;
}

.map {
  height: 500px;
  width: 100%;
  border: 3px solid #d32f2f;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.loading, .error {
  padding: 30px 20px;
  text-align: center;
  font-size: 1.1em;
  background: white;
  border-radius: 8px;
  border: 2px solid #ff9800;
  margin: 20px 0;
  color: #333;
}

.error {
  border-color: #f44336;
  color: #d32f2f;
  background: #ffebee;
}

.map-info {
  margin-top: 15px;
  padding: 12px;
  background: #e8f5e8;
  border-radius: 6px;
  border-left: 4px solid #4caf50;
  font-size: 0.9em;
  color: #2e7d32;
}

.map-info p {
  margin: 4px 0;
  color: #2e7d32;
}

.map-info strong {
  color: #d32f2f;
}

@media (min-width: 768px) {
  .map {
    height: 600px;
  }
}

@media (min-width: 1024px) {
  .map {
    height: 700px;
  }
}

@media (max-width: 360px) {
  .map {
    height: 400px;
  }
}

:deep(.popup-content) {
  max-width: 300px;
}

:deep(.popup-content h3) {
  color: #d32f2f;
  margin-bottom: 10px;
  border-bottom: 2px solid #d32f2f;
  padding-bottom: 5px;
  font-size: 1.2em;
}

:deep(.popup-content p) {
  margin: 8px 0;
  line-height: 1.4;
  color: #333;
}

:deep(.popup-content strong) {
  color: #d32f2f;
}

@media (max-width: 480px) {
  :deep(.leaflet-popup-content) {
    max-width: 250px !important;
    font-size: 0.9em;
  }
}
</style>