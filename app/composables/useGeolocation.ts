export function useGeolocation() {
  function getCurrentPosition(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no disponible en este dispositivo'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => {
          const msgs: Record<number, string> = {
            1: 'Permiso de ubicación denegado. Actívalo en tu navegador.',
            2: 'Ubicación no disponible. Intenta de nuevo.',
            3: 'Tiempo de espera agotado. Intenta de nuevo.',
          }
          reject(new Error(msgs[err.code] || 'Error al obtener ubicación'))
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      )
    })
  }

  async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
        { headers: { 'User-Agent': 'DondeMatraquearon/1.0' } },
      )
      const data = await res.json()
      const a = data.address || {}
      const parts = [
        a.road || a.pedestrian || a.path,
        a.suburb || a.neighbourhood || a.quarter,
        a.city || a.town || a.village || a.municipality,
        a.state,
      ].filter(Boolean)
      return parts.length ? parts.join(', ') : `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }
  }

  return { getCurrentPosition, reverseGeocode }
}
