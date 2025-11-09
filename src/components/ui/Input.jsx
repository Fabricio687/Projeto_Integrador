// src/components/ui/Input.jsx
export default function Input({ label, error, className = '', ...props }) {
    return (
      <label className="block">
        {label && <span className="mb-1 block text-sm text-neutral-700">{label}</span>}
        <input
          className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-0 transition placeholder:text-neutral-400 focus:border-blue-500 focus:ring focus:ring-blue-100 ${className}`}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </label>
    );
  }
  