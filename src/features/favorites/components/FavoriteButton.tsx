import { Heart } from 'lucide-react'
import { Button, IconButton, useToast } from '@/shared/design-system'
import type { IconButtonProps } from '@/shared/design-system'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  restaurantId: string
  restaurantName: string
  variant?: IconButtonProps['variant']
  /** "icon": solo icono (tarjetas); "button": con texto (perfil). */
  appearance?: 'icon' | 'button'
  className?: string
}

/** Guardar ❤️. Mismo verbo en botón y aviso: "Guardar" → "Guardado en favoritos". */
export function FavoriteButton({
  restaurantId,
  restaurantName,
  variant = 'overlay',
  appearance = 'icon',
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites()
  const toast = useToast()
  const saved = isFavorite(restaurantId)

  const onClick = async () => {
    const nowSaved = await toggle(restaurantId)
    toast.show({
      message: nowSaved
        ? `${restaurantName}: guardado en favoritos`
        : `${restaurantName}: quitado de favoritos`,
      tone: nowSaved ? 'success' : 'neutral',
    })
  }

  if (appearance === 'button') {
    return (
      <Button
        variant="ghost"
        leadingIcon={Heart}
        aria-pressed={saved}
        onClick={onClick}
        className={className}
      >
        {saved ? 'Guardado' : 'Guardar'}
      </Button>
    )
  }

  return (
    <IconButton
      icon={Heart}
      label={
        saved ? `Quitar ${restaurantName} de favoritos` : `Guardar ${restaurantName} en favoritos`
      }
      aria-pressed={saved}
      filled={saved}
      variant={variant}
      onClick={onClick}
      className={className}
    />
  )
}
