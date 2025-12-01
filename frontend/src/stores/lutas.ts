import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Luta } from '@/services/api';
import { lutasAPI } from '@/services/api';

export const useLutasStore = defineStore('lutas', () => {
  const lutas = ref<Luta[]>([]);
  const selectedLuta = ref<Luta | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchLutas = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      console.log('📡 Buscando lutas da API...');
      lutas.value = await lutasAPI.getLutas();
      console.log(`✅ ${lutas.value.length} lutas carregadas`);
    } catch (err) {
      error.value = 'Erro ao carregar lutas da API';
      console.error('❌ Erro ao carregar lutas:', err);
    } finally {
      loading.value = false;
    }
  };

  const addLuta = async (lutaData: Omit<Luta, 'id'>): Promise<Luta> => {
    try {
      const newLuta = await lutasAPI.createLuta(lutaData);
      lutas.value.push(newLuta);
      console.log('✅ Nova luta criada:', newLuta);
      return newLuta;
    } catch (err) {
      console.error('❌ Erro ao criar luta:', err);
      throw err;
    }
  };

  const selectLuta = (luta: Luta): void => {
    selectedLuta.value = luta;
    console.log('📍 Luta selecionada:', luta.titulo);
  };

  return {
    lutas,
    selectedLuta, 
    loading,
    error,
    fetchLutas,
    addLuta,
    selectLuta
  };
});