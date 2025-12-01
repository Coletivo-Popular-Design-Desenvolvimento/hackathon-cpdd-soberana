export interface Coordenadas {
  lat: number;
  lon: number;
}

export interface LutaComCoordenadas {
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

export class GeocodingService {
  static async geocodeLocalizacao(localizacao: string): Promise<[number, number]> {
    try {
      console.log(`🗺️ Geocoding: "${localizacao}"`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(localizacao + ', Brasil')}&limit=1&countrycodes=br`
      );
      
      if (!response.ok) {
        throw new Error('Erro na API de geocoding');
      }
      
      const data = await response.json();
      
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        console.log(`✅ Geocoding OK: ${localizacao} → [${lat}, ${lon}]`);
        return [lat, lon];
      } else {
        console.warn(`⚠️ Localização não encontrada: ${localizacao}`);
        return this.getRandomBrasilPosition();
      }
    } catch (error) {
      console.error(`❌ Erro no geocoding: ${error}`);
      return this.getRandomBrasilPosition();
    }
  }

  static getRandomBrasilPosition(): [number, number] {
    // Brasil aproximado: lat -15 à -30, lng -75 à -35
    const lat = -15 + (Math.random() * 15 - 30);
    const lng = -75 + (Math.random() * 40 - 35);
    console.log(`🎲 Posição aleatória: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
    return [lat, lng];
  }

  static async geocodeAllLutas(lutas: LutaComCoordenadas[]): Promise<LutaComCoordenadas[]> {
    const lutasComCoordenadas: LutaComCoordenadas[] = [];
    
    for (const luta of lutas) {
      let coords: [number, number];
      
      if (luta.latitude && luta.longitude) {
        coords = [luta.latitude, luta.longitude];
      } else {
        coords = await this.geocodeLocalizacao(luta.localizacao);
      }
      
      lutasComCoordenadas.push({
        ...luta,
        latitude: coords[0],
        longitude: coords[1]
      });
    }
    
    return lutasComCoordenadas;
  }
}