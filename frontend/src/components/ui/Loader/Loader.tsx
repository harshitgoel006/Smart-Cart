export function Loader({ label = 'Loading...' }: { label?: string }) {
  return <div className="ui-loader" role="status">{label}</div>
}
