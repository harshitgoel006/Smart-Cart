export function ErrorState({ message = 'Something went wrong.' }: { message?: string }) {
  return <div className="api-notice">{message}</div>
}
