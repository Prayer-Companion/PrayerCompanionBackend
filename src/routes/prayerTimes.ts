import {Request, Response, Router} from 'express';
import {query, validationResult} from 'express-validator';
import {CalculationMethod, Coordinates, PrayerTimes} from 'adhan';
import {ParamsDictionary} from 'express-serve-static-core';
import {StatusCodes} from 'http-status-codes';
import moment from 'moment-timezone';
import {countryCodeOrNullValidator, countryCodeValidator, isStringOrNull, validateTimeZone} from "../customValidators";
import DailyPrayers from "../models/dailyPrayers";
import {daysBetween} from "../utils/dateUtils";
import {parse} from 'csv-parse';
import fs from 'fs'
import sanitize from "sanitize-filename";

export const prayerTimesRouter = Router()

const dateFormat = 'DD/MM/YYYY'
const timeFormat = 'HH:mm'

prayerTimesRouter.get('',
    query('timeZone').custom(validateTimeZone),
    query('latitude').isNumeric(),
    query('longitude').isNumeric(),
    query('longitude').isNumeric(),
    query('monthOfYear').isString().matches("^(0[1-9]|1[0-2])\\/\\d{4}$"),
    query('countryCode').custom(countryCodeOrNullValidator),
    async (
        req: Request<ParamsDictionary, any, any, {
            timeZone: string
            latitude: number
            longitude: number
            monthOfYear: string
            countryCode?: string
            cityName?: string
        }>,
        res: Response) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()})
        }

        const query = req.query

        if (query.countryCode != null && query.cityName != null) {
            const result = await getStoredDailyPrayerTimes(query.countryCode, query.cityName, query.monthOfYear, query.timeZone)

            if (result.length > 0) {
                return res.json(result)
            }
        }

        const result = calculateDailyPrayerTimes(query.latitude, query.longitude, query.monthOfYear, query.timeZone)

        res.json(result)
    })

async function getStoredDailyPrayerTimes(countryCode: string, cityName: string, monthOfYear: string, timeZone: string) {
    const result: DailyPrayers[] = []

    const startDate = moment.utc(`01/${monthOfYear}`, dateFormat)
    const endDate = startDate.clone().endOf('month').toDate()
    const startOfYearDate = startDate.clone().month('January').toDate()


    const safeCountryCode = sanitize(countryCode);
    const safeCityName = sanitize(cityName);

    const filePath = `${appRoot}/prayerTimes/${startDate.year}/${safeCountryCode}/${safeCityName}.csv`


    console.log(filePath)
    try {
        if (fs.existsSync(filePath)) {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(parse({
                        delimiter: ",",
                        fromLine: daysBetween(startOfYearDate, startDate.toDate()) + 1,
                        toLine: daysBetween(startOfYearDate, endDate)
                    }))
                    .on('data', line => {
                        result.push({
                            date: line[0],
                            fajr: line[1],
                            sunrise: line[2],
                            dhuhr: line[3],
                            asr: line[4],
                            maghrib: line[5],
                            isha: line[6],
                        });
                    })
                    .on('end', () => resolve(null))
                    .on('error', err => reject(err))
            })
        }
    } catch (e) {
        console.log(`getStoredDailyPrayerTimes : ${e}`)
    }

    return result
}

function calculateDailyPrayerTimes(latitude: number, longitude: number, monthOfYear: string, timeZone: string) {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.MoonsightingCommittee();


    const date = moment(`01/${monthOfYear}`, dateFormat)
    const monthLastDay = date.clone().endOf('month').date()


    const result: DailyPrayers[] = []

    for (let currentDay = 1; currentDay <= monthLastDay; currentDay++) {
        const currentDate = date.clone().date(currentDay)

        const prayerTimes = new PrayerTimes(coordinates, currentDate.toDate(), params);

        result.push({
            'date': currentDate.format(dateFormat),
            'fajr': moment(prayerTimes.fajr).tz(timeZone).format(timeFormat),
            'sunrise': moment(prayerTimes.sunrise).tz(timeZone).format(timeFormat),
            'dhuhr': moment(prayerTimes.dhuhr).tz(timeZone).format(timeFormat),
            'asr': moment(prayerTimes.asr).tz(timeZone).format(timeFormat),
            'maghrib': moment(prayerTimes.maghrib).tz(timeZone).format(timeFormat),
            'isha': moment(prayerTimes.isha).tz(timeZone).format(timeFormat),
        })
    }

    return result
}
