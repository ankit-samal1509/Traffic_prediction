const BASE_URL = import.meta.env.VITE_API_URL;

export const getAreas = async () => {
  const res = await fetch(`${BASE_URL}/areas`)
  if (!res.ok) throw new Error('Failed to fetch areas')
  return res.json()
}

export const getWeathers = async () => {
  const res = await fetch(`${BASE_URL}/weathers`)
  if (!res.ok) throw new Error('Failed to fetch weathers')
  return res.json()
}

export const getRoads = async () => {
  const res = await fetch(`${BASE_URL}/roads`)
  if (!res.ok) throw new Error('Failed to fetch roads')
  return res.json()
}

export const predictTraffic = async (payload) => {
  const res = await fetch(`${BASE_URL}/predict`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload)
  })

  if (!res.ok) throw new Error('Prediction failed')
  return res.json()
}