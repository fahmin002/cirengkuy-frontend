export function formatDateTime(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
export function formatDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit'
  }).format(date);
}

export function formatMonthYear(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}