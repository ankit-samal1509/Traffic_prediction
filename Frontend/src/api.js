export const getAreas = async () => {
  const res = await fetch('/api/areas')
  if (!res.ok) throw new Error('Failed to fetch areas')
  return res.json()
}

export const getWeathers = async () => {
  const res = await fetch('/api/weathers')
  if (!res.ok) throw new Error('Failed to fetch weathers')
  return res.json()
}

export const getRoads = async () => {
  const res = await fetch('/api/roads')
  if (!res.ok) throw new Error('Failed to fetch roads')
  return res.json()
}

export const predictTraffic = async (payload) => {
  const res = await fetch('/api/predict', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload)
  })

  if (!res.ok) throw new Error('Prediction failed')
  return res.json()
}