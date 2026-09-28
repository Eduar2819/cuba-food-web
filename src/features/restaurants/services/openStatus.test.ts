import type { Schedule, SpecialSchedule } from '../types'
import { getOpenStatus, getRangesForDate } from './openStatus'

/** Instante a partir de hora local de Mérida (UTC-6, sin horario de verano). */
const at = (local: string) => new Date(`${local}:00-06:00`)

// 2026-09-28 es lunes.
const simple: Schedule = {
  1: [{ open: '13:00', close: '23:00' }],
  2: [{ open: '12:00', close: '22:00' }],
}

describe('getOpenStatus', () => {
  it('abierto: indica la hora de cierre', () => {
    const status = getOpenStatus(simple, [], at('2026-09-28T15:00'))
    expect(status.state).toBe('open')
    expect(status.label).toBe('Cierra a las 11:00 PM')
    expect(status.minutesUntilChange).toBe(480)
    expect(status.next).toEqual({ type: 'closes', time: '23:00', dayOffset: 0 })
  })

  it('cierra pronto cuando faltan menos de 60 minutos', () => {
    const status = getOpenStatus(simple, [], at('2026-09-28T22:15'))
    expect(status.state).toBe('closing-soon')
    expect(status.minutesUntilChange).toBe(45)
  })

  it('con exactamente 60 minutos sigue "abierto"', () => {
    expect(getOpenStatus(simple, [], at('2026-09-28T22:00')).state).toBe('open')
  })

  it('cerrado antes de abrir: abre hoy (con "a la" para la 1)', () => {
    const status = getOpenStatus(simple, [], at('2026-09-28T10:00'))
    expect(status.state).toBe('closed')
    expect(status.label).toBe('Abre hoy a la 1:00 PM')
    expect(status.next).toEqual({ type: 'opens', time: '13:00', dayOffset: 0 })
  })

  it('cerrado después del cierre: abre mañana', () => {
    const status = getOpenStatus(simple, [], at('2026-09-28T23:30'))
    expect(status.state).toBe('closed')
    expect(status.label).toBe('Abre mañana a las 12:00 PM')
  })

  it('en el minuto exacto de cierre ya está cerrado', () => {
    expect(getOpenStatus(simple, [], at('2026-09-28T23:00')).state).toBe('closed')
  })

  it('usa el nombre del día cuando la apertura es en pocos días', () => {
    // Martes 23:00 → próximo lunes queda a 6 días.
    const status = getOpenStatus(simple, [], at('2026-09-29T23:00'))
    expect(status.label).toBe('Abre el lunes a la 1:00 PM')
  })

  describe('horario partido', () => {
    const split: Schedule = {
      1: [
        { open: '13:00', close: '16:30' },
        { open: '19:00', close: '23:30' },
      ],
    }

    it('en el primer turno cierra a la hora del primer turno', () => {
      const status = getOpenStatus(split, [], at('2026-09-28T16:00'))
      expect(status.state).toBe('closing-soon')
      expect(status.label).toBe('Cierra a las 4:30 PM')
    })

    it('entre turnos indica la reapertura de hoy', () => {
      const status = getOpenStatus(split, [], at('2026-09-28T17:00'))
      expect(status.state).toBe('closed')
      expect(status.label).toBe('Abre hoy a las 7:00 PM')
    })
  })

  describe('cruce de medianoche', () => {
    // Viernes 19:00 a sábado 01:30.
    const late: Schedule = { 5: [{ open: '19:00', close: '01:30' }] }

    it('sigue abierto después de medianoche con el horario del día anterior', () => {
      const status = getOpenStatus(late, [], at('2026-10-03T00:45'))
      expect(status.state).toBe('closing-soon')
      expect(status.label).toBe('Cierra a la 1:30 AM')
    })

    it('el viernes en la noche indica cierre en la madrugada', () => {
      const status = getOpenStatus(late, [], at('2026-10-02T21:00'))
      expect(status.state).toBe('open')
      expect(status.next).toEqual({ type: 'closes', time: '01:30', dayOffset: 1 })
    })

    it('después del cierre de madrugada está cerrado', () => {
      expect(getOpenStatus(late, [], at('2026-10-03T01:40')).state).toBe('closed')
    })

    it('"24:00" cierra a medianoche', () => {
      const midnight: Schedule = { 1: [{ open: '14:00', close: '24:00' }] }
      const status = getOpenStatus(midnight, [], at('2026-09-28T23:30'))
      expect(status.state).toBe('closing-soon')
      expect(status.label).toBe('Cierra a las 12:00 AM')
    })

    it('fusiona rangos contiguos entre días', () => {
      const contiguous: Schedule = {
        1: [{ open: '12:00', close: '24:00' }],
        2: [{ open: '00:00', close: '02:00' }],
      }
      const status = getOpenStatus(contiguous, [], at('2026-09-28T23:30'))
      expect(status.state).toBe('open')
      expect(status.label).toBe('Cierra a las 2:00 AM')
    })
  })

  describe('horarios especiales', () => {
    const holiday: SpecialSchedule = {
      id: 'h',
      from: '2026-09-28',
      to: '2026-09-28',
      kind: 'closed',
      label: 'Día festivo',
    }

    it('un festivo cierra el día y se expone el motivo', () => {
      const status = getOpenStatus(simple, [holiday], at('2026-09-28T15:00'))
      expect(status.state).toBe('closed')
      expect(status.specialLabel).toBe('Día festivo')
      expect(status.label).toBe('Abre mañana a las 12:00 PM')
    })

    it('un horario especial reemplaza al semanal', () => {
      const shortDay: SpecialSchedule = {
        id: 's',
        from: '2026-09-28',
        to: '2026-09-28',
        kind: 'hours',
        ranges: [{ open: '13:00', close: '18:00' }],
        label: 'Horario especial',
      }
      expect(getOpenStatus(simple, [shortDay], at('2026-09-28T18:30')).state).toBe('closed')
      expect(getOpenStatus(simple, [shortDay], at('2026-09-28T17:30')).label).toBe(
        'Cierra a las 6:00 PM',
      )
    })

    it('un cierre temporal de varios días indica la fecha de reapertura', () => {
      const weekdays: Schedule = { 1: [{ open: '08:00', close: '18:00' }] }
      const remodel: SpecialSchedule = {
        id: 'r',
        from: '2026-09-21',
        to: '2026-10-04',
        kind: 'closed',
        label: 'Cierre temporal por remodelación',
      }
      const status = getOpenStatus(weekdays, [remodel], at('2026-09-28T10:00'))
      expect(status.state).toBe('closed')
      expect(status.specialLabel).toBe('Cierre temporal por remodelación')
      expect(status.label).toBe('Abre el lunes 5 de octubre a las 8:00 AM')
    })
  })

  it('sin horario: cerrado sin próxima apertura', () => {
    const status = getOpenStatus({}, [], at('2026-09-28T12:00'))
    expect(status).toMatchObject({ state: 'closed', next: null, label: 'Sin horario disponible' })
  })

  it('abierto las 24 horas', () => {
    const allDay: Schedule = Object.fromEntries(
      [0, 1, 2, 3, 4, 5, 6].map((d) => [d, [{ open: '00:00', close: '24:00' }]]),
    )
    const status = getOpenStatus(allDay, [], at('2026-09-28T03:00'))
    expect(status.state).toBe('open')
    expect(status.label).toBe('Abierto las 24 horas')
  })

  it('evalúa en America/Merida sin importar la zona del instante', () => {
    // 05:30 UTC del lunes = 23:30 del domingo en Mérida.
    const sunday: Schedule = { 0: [{ open: '20:00', close: '24:00' }] }
    const status = getOpenStatus(sunday, [], new Date('2026-09-28T05:30:00Z'))
    expect(status.state).toBe('closing-soon')
  })
})

describe('getRangesForDate', () => {
  it('prefiere la excepción sobre el horario semanal', () => {
    const special: SpecialSchedule = {
      id: 'x',
      from: '2026-09-28',
      to: '2026-09-30',
      kind: 'closed',
      label: 'Vacaciones',
    }
    expect(getRangesForDate(simple, [special], '2026-09-29')).toEqual([])
    expect(getRangesForDate(simple, [special], '2026-10-05')).toEqual(simple[1])
  })
})
