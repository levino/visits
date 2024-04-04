import { describe, expect, test } from 'bun:test'
import {
  calenderWeekToWeekend,
  getLastDayOfFirstWeek,
} from './calenderWeeksToWeekends'

describe('calenderweekToWeekend', () => {
  test.each([
    [1, '2022', [new Date('2022-01-08'), new Date('2022-01-09')]],
    [2, '2022', [new Date('2022-01-15'), new Date('2022-01-16')]],
    [3, '2022', [new Date('2022-01-22'), new Date('2022-01-23')]],
    [4, '2022', [new Date('2022-01-29'), new Date('2022-01-30')]],
  ] as [number, string, [Date, Date]][])(
    'Should return the correct weekend for a given calenderweek',
    (calenderWeek, year, weekend) =>
      expect(JSON.stringify(calenderWeekToWeekend(year)(calenderWeek))).toBe(
        JSON.stringify(weekend)
      )
  )
  test('last day of first week 2022', () => {
    expect(JSON.stringify(getLastDayOfFirstWeek('2022'))).toBe(
      JSON.stringify(new Date('2022-01-09'))
    )
  })
})
