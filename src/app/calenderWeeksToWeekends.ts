import {
  addDays,
  addWeeks,
  lastDayOfWeekWithOptions,
  subDays,
} from 'date-fns/fp'
import { identity, juxt, pipe } from 'ramda'

export const calenderWeekToWeekend =
  (year: string) =>
  (calenderWeek: number): [Date, Date] =>
    pipe(
      getLastDayOfFirstWeek,
      addWeeks(calenderWeek - 1),
      juxt([subDays(1), identity]) as (date: Date) => [Date, Date]
    )(year)

const yearToDate = (year: string) => new Date(year)

export const getLastDayOfFirstWeek: (year: string) => Date = (year) =>
  pipe(
    yearToDate,
    addDays(3),
    lastDayOfWeekWithOptions({ weekStartsOn: 1 })
  )(year)
