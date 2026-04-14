export default function InputField({ label, name, type = 'number',
                                     value, onChange, min, max, step }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-400
                   focus:border-transparent transition"
      />
    </div>
  )
}