export function formatTime(date) {
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(date)
}
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
