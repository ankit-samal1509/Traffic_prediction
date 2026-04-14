export default function ResultCard({ result }) {
  if (!result) return null

  const level = result.traffic_volume > 40000 ? 'High'
              : result.traffic_volume > 20000 ? 'Medium' : 'Low'

  const colors = {
    High  : 'bg-red-50 border-red-200 text-red-600',
    Medium: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    Low   : 'bg-green-50 border-green-200 text-green-600'
  }

  return (
    <div className={`mt-8 p-6 rounded-2xl border-2 text-center ${colors[level]}`}>
      <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
        Predicted Traffic Volume
      </p>
      <p className="text-5xl font-bold">
        {result.traffic_volume.toLocaleString()}
      </p>
      <p className="text-sm mt-1 opacity-70">vehicles</p>
      <span className={`inline-block mt-3 px-4 py-1 rounded-full text-xs 
                        font-semibold border ${colors[level]}`}>
        Congestion: {level}
      </span>
    </div>
  )
}