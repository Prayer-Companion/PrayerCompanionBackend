import {Request, Response, Router} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {query, validationResult} from "express-validator";
import {PrayerNames, PrayerStatuses, PrismaClient} from '@prisma/client'
import moment from "moment-timezone";
import {daysBetween, loopBetweenDates} from "../utils/dateUtils";
import {StatusCodes} from "http-status-codes";
import {validateTimeZone} from "../customValidators";

const prisma = new PrismaClient()

export const prayerStatusesRouter = Router()

const dateFormat = 'DD/MM/YYYY'

const getPrayerStatuses = async (userId: number, startDate: Date, endDate: Date) => {
    return prisma.prayerStatus.findMany({
        where: {
            prayerRecord: {
                userId: userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                }
            }
        },
        include: {
            prayerRecord: true
        }
    });
}

prayerStatusesRouter.get('/user/:userId/prayerStatuses',
    query('timeZone').custom(validateTimeZone),
    query('startDate').isDate({format: dateFormat}),
    query('endDate').isDate({format: dateFormat}),
    async (
        req: Request<ParamsDictionary, any, any, {
            timeZone: string,
            startDate: string,
            endDate: string,
        }>,
        res: Response
    ) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors)
        }

        const userId: number = parseInt(req.params.userId)
        const timeZone = req.query.timeZone
        const startDate = moment.tz(req.query.startDate, dateFormat, timeZone).toDate()
        const endDate = moment.tz(req.query.endDate, dateFormat, timeZone).toDate()

        const prayerStatuses = await getPrayerStatuses(userId, startDate, endDate)


        //Format response
        const result: ResponseItem[] = []

        loopBetweenDates(
            {date: startDate, inclusive: true},
            {date: endDate, inclusive: true},
            date => {
                result.push({
                    date: moment(date).tz(timeZone).format(dateFormat),
                    fajr: 'none',
                    dhuhr: 'none',
                    asr: 'none',
                    maghrib: 'none',
                    isha: 'none',
                })
            }
        )

        prayerStatuses.forEach((value, index, array) => {
            const daysDiff = daysBetween(startDate, value.prayerRecord.date)
            result[daysDiff][value.name] = value.status
        })


        return res.json(result)
    }
)

prayerStatusesRouter.put(
    '/user/:userId/prayerStatus',
    query('timeZone').custom(validateTimeZone),
    query('date').isDate({format: dateFormat}),
    query('prayerName').custom(async value => {
        if (!(value in PrayerNames)) {
            throw new Error('invalid value')
        }
    }),
    query('prayerStatus').custom(async value => {
        if (!(value in PrayerStatuses)) {
            throw new Error('invalid value')
        }
    }),
    async (
        req: Request<ParamsDictionary, any, any, {
            timeZone: string,
            date: string
            prayerName: PrayerNames,
            prayerStatus: PrayerStatuses
        }>, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors)
        }

        const timeZone = req.query.timeZone
        const userId = parseInt(req.params!!.userId)
        const query = req.query
        const date = moment.tz(query.date, dateFormat, timeZone).toDate()

        const prayerRecord = await prisma.prayerRecord.upsert({
            create: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                date: date
            },
            update: {},
            where: {
                userId_date: {
                    userId: userId,
                    date: date
                }
            },
        })

        const prayerStatuses = await prisma.prayerStatus.upsert({
            where: {
                recordId_name: {
                    recordId: prayerRecord.id,
                    name: query.prayerName,
                }
            },
            update: {
                status: query.prayerStatus,
            },
            create: {
                name: query.prayerName,
                status: query.prayerStatus,
                recordId: prayerRecord.id
            },
            // include: {prayerRecord: true},
        })

        return res.json(prayerStatuses)

    })

interface ResponseItem {
    date: string
    'fajr': PrayerStatuses,
    'dhuhr': PrayerStatuses,
    'asr': PrayerStatuses,
    'maghrib': PrayerStatuses,
    'isha': PrayerStatuses,
}