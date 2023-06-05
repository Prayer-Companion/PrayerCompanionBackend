import {Request, Response, Router} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {query, validationResult} from "express-validator";
import {PrayerNames, PrayerStatuses, PrismaClient} from '@prisma/client'
import moment from "moment-timezone";
import {daysBetween, loopBetweenDates} from "../utils/dateUtils";
import {StatusCodes} from "http-status-codes";
import DailyPrayers from "../models/dailyPrayers";

const prisma = new PrismaClient()

export const prayerStatusesRouter = Router()

const dateFormat = 'DD/MM/YYYY'

const getPrayerStatuses = async (userId: number, startDate: Date, endDate: Date) => {
    try {
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
    } catch (e) {
        console.log(e)
        return []
    }
}

prayerStatusesRouter.get('/user/prayerStatuses',
    query('startDate').isDate({format: dateFormat}),
    query('endDate').isDate({format: dateFormat}),
    async (
        req: Request<ParamsDictionary, any, any, {
            startDate: string,
            endDate: string,
        }>,
        res: Response
    ) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors)
        }

        const userId: number = req.userId
        const startDate = moment.utc(req.query.startDate, dateFormat).toDate()
        const endDate = moment.utc(req.query.endDate, dateFormat).toDate()

        const prayerStatuses = await getPrayerStatuses(userId, startDate, endDate)


        //Format response
        const result: DailyPrayers[] = []

        loopBetweenDates(
            {date: startDate, inclusive: true},
            {date: endDate, inclusive: true},
            date => {
                result.push({
                    date: moment(date).utc().format(dateFormat),
                    fajr: 'none',
                    sunrise: 'none',
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
    '/user/prayerStatus',
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
            date: string
            prayerName: PrayerNames,
            prayerStatus: PrayerStatuses
        }>, res) => {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors)
        }

        const userId = req.userId
        const query = req.query
        const date = moment.utc(query.date, dateFormat).toDate()

        try {
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
                include: {prayerRecord: true},
            })

            return res.json(prayerStatuses)
        } catch (e) {
            console.log(e)
            return res.status(StatusCodes.BAD_REQUEST).json('Something went wrong during updating prayerStatus')
        }
    })