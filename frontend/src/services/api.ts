import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export interface Luta {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  tipo: string;
  necessidades: string;
  contato: string;
  latitude?: number;
  longitude?: number;
}

export const lutasAPI = {
  async getLutas(): Promise<Luta[]> {
    const response = await axios.get<Luta[]>(`${API_BASE}/lutas`);
    return response.data;
  },

  async createLuta(luta: Omit<Luta, 'id'>): Promise<Luta> {
    const response = await axios.post<Luta>(`${API_BASE}/lutas`, luta);
    return response.data;
  },

  async getLuta(id: number): Promise<Luta> {
    const response = await axios.get<Luta>(`${API_BASE}/lutas/${id}`);
    return response.data;
  }
};