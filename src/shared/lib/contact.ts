/** "+529990000101" → "+52 999 000 0101" (formato mexicano de 10 dígitos). */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const local = digits.startsWith('52') ? digits.slice(2) : digits
  if (local.length !== 10) return phone
  return `+52 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** Enlace wa.me con mensaje prellenado. */
export function whatsappHref(number: string, message?: string): string {
  const base = `https://wa.me/${number.replace(/\D/g, '')}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function shareLinks(url: string, text: string) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(text)
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://x.com/intent/post?url=${u}&text=${t}`,
  }
}
