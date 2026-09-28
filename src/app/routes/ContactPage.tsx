import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { CircleCheck, Send } from 'lucide-react'
import { Button, Card, EmptyState, Input, PageHeader, Select } from '@/shared/design-system'
import { Seo } from '@/features/seo'

const REASONS = [
  { value: 'registro', label: 'Quiero registrar mi restaurante' },
  { value: 'correccion', label: 'Corregir datos de un restaurante' },
  { value: 'sugerencia', label: 'Sugerir un restaurante' },
  { value: 'otro', label: 'Otro motivo' },
]

const PLAN_LABEL: Record<string, string> = {
  basico: 'Básico',
  destacado: 'Destacado',
  premium: 'Premium',
}

type Errors = Partial<Record<'name' | 'email' | 'message', string>>

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!String(data.get('name') ?? '').trim()) errors.name = 'Escribe tu nombre.'
  const email = String(data.get('email') ?? '').trim()
  if (!email) errors.email = 'Escribe tu correo para poder responderte.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Revisa el correo: parece incompleto.'
  if (String(data.get('message') ?? '').trim().length < 10)
    errors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
  return errors
}

/** Contacto: validación en el cliente. Prototipo sin backend: no se envía nada. */
export function ContactPage() {
  const [params] = useSearchParams()
  const plan = params.get('plan') ?? ''
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(new FormData(event.currentTarget))
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setSent(true)
  }

  return (
    <div className="container-page pb-8">
      <Seo
        title="Contacto"
        description="Escríbenos para registrar tu restaurante o corregir datos de la guía."
        path="/contacto"
      />
      <PageHeader
        title="Contacto"
        description="Registra tu restaurante, corrige datos o sugiérenos un lugar. Te respondemos en dos días hábiles."
      />
      <div className="max-w-2xl">
        {sent ? (
          <EmptyState
            icon={CircleCheck}
            title="Mensaje enviado (simulación)."
            description="Este prototipo no envía mensajes: en la versión real te llegaría una confirmación por correo."
            action={
              <Button variant="secondary" onClick={() => setSent(false)}>
                Escribir otro mensaje
              </Button>
            }
          />
        ) : (
          <Card variant="outlined" padding="lg">
            <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="grid gap-6 tablet:grid-cols-2">
                <Input
                  label="Nombre"
                  name="name"
                  autoComplete="name"
                  required
                  error={errors.name}
                />
                <Input
                  label="Correo"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  hint="Solo lo usamos para responderte."
                  error={errors.email}
                />
              </div>
              <Input label="Restaurante (opcional)" name="restaurant" autoComplete="organization" />
              <Select
                label="Motivo"
                name="reason"
                options={REASONS}
                defaultValue={plan ? 'registro' : 'sugerencia'}
                hint={plan ? `Plan elegido: ${PLAN_LABEL[plan] ?? plan}` : undefined}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-small font-semibold text-ink">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className="w-full rounded-md bg-surface px-4 py-3 text-body text-ink ring-1 ring-line-strong ring-inset placeholder:text-ink-muted focus:ring-2 focus:ring-focus focus:outline-none aria-invalid:ring-2 aria-invalid:ring-danger"
                  defaultValue={plan ? `Me interesa el plan ${PLAN_LABEL[plan] ?? plan}.` : ''}
                />
                {errors.message && (
                  <p id="message-error" className="text-caption font-medium text-danger">
                    {errors.message}
                  </p>
                )}
              </div>
              <Button type="submit" size="lg" leadingIcon={Send} className="self-start">
                Enviar mensaje
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
