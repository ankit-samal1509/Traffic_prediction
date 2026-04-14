import { useState, useEffect } from 'react'
import { getAreas, getWeathers, getRoads, predictTraffic } from '../api'
import InputField from './InputField'
import ResultCard from './ResultCard'

const DEFAULT = {
  area                     : '',
  weather                  : '',
  roadwork                 : '',
  average_speed            : 35,
  congestion_level         : 70,
  travel_time_index        : 1.5,
  road_capacity_utilization: 75,
  incident_reports         : 1,
  pedestrian_count         : 150,
  public_transport_usage   : 40,
  traffic_signal_compliance: 80,
  parking_usage            : 55,
  month                    : 4,
  day_of_week              : 1,
  day                      : 14,
}

export default function PredictionForm() {
  const [form,    setForm]    = useState(DEFAULT)
  const [areas,   setAreas]   = useState([])
  const [weathers,setWeathers]= useState([])
  const [roads,   setRoads]   = useState([])
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    getAreas()   .then(d => { setAreas(d.areas);    setForm(f => ({...f, area   : d.areas[0]}))   })
    getWeathers().then(d => { setWeathers(d.weathers); setForm(f => ({...f, weather: d.weathers[0]})) })
    getRoads()   .then(d => { setRoads(d.roads);    setForm(f => ({...f, roadwork: d.roads[0]}))  })
  }, [])

  const handle = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictTraffic(form)
      if (data.success) setResult(data)
      else setError(data.error)
    } catch {
      setError('Could not connect to server. Is Flask running?')
    } finally {
      setLoading(false)
    }
  }

  const Section = ({ title }) => (
    <p className="text-xs font-semibold text-indigo-500 uppercase
                  tracking-widest mt-6 mb-3">{title}</p>
  )

  return (
    <form onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

      <Section title="Location & Time" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Area
          </label>
          <select name="area" value={form.area} onChange={handle}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Weather
          </label>
          <select name="weather" value={form.weather} onChange={handle}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {weathers.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Roadwork
          </label>
          <select name="roadwork" value={form.roadwork} onChange={handle}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {roads.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <InputField label="Month (1–12)"        name="month"
                    value={form.month}           onChange={handle} min={1} max={12}/>
        <InputField label="Day of Week (0–6)"   name="day_of_week"
                    value={form.day_of_week}     onChange={handle} min={0} max={6}/>
        <InputField label="Day of Month"        name="day"
                    value={form.day}             onChange={handle} min={1} max={31}/>
      </div>

      <Section title="Traffic Conditions" />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Average Speed (km/h)"      name="average_speed"
                    value={form.average_speed}         onChange={handle} step="0.1"/>
        <InputField label="Incident Reports"          name="incident_reports"
                    value={form.incident_reports}      onChange={handle}/>
        <InputField label="Pedestrian & Cyclist Count" name="pedestrian_count"
                    value={form.pedestrian_count}      onChange={handle}/>
      </div>

      <Section title="Infrastructure" />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Public Transport Usage (%)"    name="public_transport_usage"
                    value={form.public_transport_usage}   onChange={handle} step="0.1"/>
        <InputField label="Signal Compliance (%)"         name="traffic_signal_compliance"
                    value={form.traffic_signal_compliance} onChange={handle} step="0.1"/>
        <InputField label="Parking Usage (%)"             name="parking_usage"
                    value={form.parking_usage}            onChange={handle} step="0.1"/>
      </div>

      <button type="submit" disabled={loading}
              className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700
                         disabled:bg-indigo-300 text-white font-semibold
                         rounded-xl transition text-base">
        {loading ? 'Predicting...' : 'Predict Traffic Volume'}
      </button>

      {error && (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      )}

      <ResultCard result={result} />
    </form>
  )
}