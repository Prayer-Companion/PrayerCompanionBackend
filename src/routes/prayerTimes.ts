import {Request, Response, Router} from 'express';
import {query, validationResult} from 'express-validator';
import {CalculationMethod, Coordinates, PrayerTimes} from 'adhan';
import {ParamsDictionary} from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import moment from 'moment-timezone';

export const prayerTimesRouter = Router()

const dateFormat = 'DD/MM/YYYY'
const timeFormat = 'hh:mm a'

prayerTimesRouter.get('/prayerTimes',
    query('timeZone').isString(),
    query('latitude').isNumeric(),
    query('longitude').isNumeric(),
    query('longitude').isNumeric(),
    query('date').isDate({format: dateFormat}),
    (req: PrayerTimesRequest, res: PrayerTimesResponse) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()})
        }

        const query = req.query
        const coordinates = new Coordinates(query.latitude, query.longitude);
        const params = CalculationMethod.MoonsightingCommittee();

        const date = moment(query.date, dateFormat)
        const monthLastDay = date.clone().endOf('month').date()

        const result: DailyPrayers[] = []

        for (let currentDay = 1; currentDay <= monthLastDay; currentDay++) {
            const currentDate = date.clone().date(currentDay)

            const prayerTimes = new PrayerTimes(coordinates, currentDate.toDate(), params);

            result.push({
                'date': currentDate.format(dateFormat),
                'fajr': moment(prayerTimes.fajr).tz(query.timeZone).format(timeFormat),
                // 'sunrise': moment(prayerTimes.sunrise).tz(query.timeZone).format(timeFormat),
                'dhuhr': moment(prayerTimes.dhuhr).tz(query.timeZone).format(timeFormat),
                'asr': moment(prayerTimes.asr).tz(query.timeZone).format(timeFormat),
                // 'sunset': moment(prayerTimes.sunrise).tz(query.timeZone).format(timeFormat),
                'maghrib': moment(prayerTimes.maghrib).tz(query.timeZone).format(timeFormat),
                'isha': moment(prayerTimes.isha).tz(query.timeZone).format(timeFormat),
            })
        }

        res.json(result)
    })

type PrayerTimesRequest = Request<ParamsDictionary, any, any, Query>
type PrayerTimesResponse = Response

interface Query {
    timeZone: string,
    latitude: number,
    longitude: number,
    date: string;
}

interface DailyPrayers {
    date: string
    'fajr': string,
    'dhuhr': string,
    'asr': string,
    'maghrib': string,
    'isha': string
}