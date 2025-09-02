export default function Loader({ label = "Loading…" }) {
  return (
    <div className="text-sm text-gray-500">{label}</div>
  );
}