import { html } from '@elysiajs/html'
import { swagger } from '@elysiajs/swagger'
import { google } from 'googleapis'
import { always, equals, ifElse, map, path, pipe, prop, reject } from 'ramda'
import { Layout } from '~/components/Layout'
import { createElysia } from '~/util/elysia'
import { calenderWeekToWeekend } from './calenderWeeksToWeekends'

type Weekend = { calendarWeek: number; booked: boolean }
const isBooked: (weekend: Weekend) => boolean = prop('booked')

export const app = createElysia()
  // Plugins on all routes
  .use(swagger())

  // Plugins on all page routes
  .use(html())

  .get('/', async (ctx) =>
    getRows().then((data) => {
      const availableWeekends = pipe(
        reject(isBooked),
        map(prop('calendarWeek')),
        map(calenderWeekToWeekend('2024'))
      )(data)
      return (
        <Layout>
          <div class='px-6 py-6'>
            Wir möchten Euch am{' '}
            <select class='dark:bg-black dark:text-white'>
              {availableWeekends.map(([saturday, sunday], index) => (
                <option selected={index === 0 ? '' : undefined}>
                  {saturday.toLocaleDateString()} -{' '}
                  {sunday.toLocaleDateString()}
                </option>
              ))}
            </select>
            <select class='dark:bg-black dark:text-white'>
              <option>besuchen</option>
              <option>zu uns einladen</option>
            </select>
            .<div hx-get='/todos' hx-trigger='load' hx-swap='innerHTML'></div>
          </div>
        </Layout>
      )
    })
  )
  .get('/health', () => 'ok')

const parseRow = map(([calendarWeek, booked]) => ({
  calendarWeek: parseInt(calendarWeek),
  booked: ifElse(equals('TRUE'), always(true), always(false))(booked),
}))

type SheetResponse = { data: { values: [string, string][] } }
const getRows = () =>
  google.auth
    .getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    .then(
      (auth) =>
        google.sheets({ version: 'v4', auth }).spreadsheets.values.get({
          spreadsheetId: process.env.SHEET_ID,
          range: 'Sheet1!A2:B',
        }) as unknown as Promise<SheetResponse>
    )
    .then(
      pipe(
        path(['data', 'values']) as (
          response: SheetResponse
        ) => [string, string][],
        parseRow
      )
    ) as Promise<{ calendarWeek: number; booked: boolean }[]>

export type App = typeof app
