import type { DialogProps } from './Dialog'
import { Dialog } from './Dialog'

export interface DrawerProps extends Omit<DialogProps, 'placement'> {
  /** responsive: bottom sheet en móvil, panel lateral desde tablet. */
  side?: 'right' | 'bottom' | 'responsive'
}

export function Drawer({ side = 'responsive', ...props }: DrawerProps) {
  const placement = side === 'responsive' ? 'sheet' : side
  return <Dialog placement={placement} {...props} />
}

export function BottomSheet(props: Omit<DialogProps, 'placement'>) {
  return <Dialog placement="bottom" {...props} />
}
