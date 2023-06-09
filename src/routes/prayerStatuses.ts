import {Request, Response, Router} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {query, validationResult} from "express-validator";
import {PrayerNames, PrayerStatuses, PrismaClient} from '@prisma/client'
import moment from "moment-timezone";
import {daysBetween, loopBetweenDates} from "../utils/dateUtils";
import {StatusCodes} from "http-status-codes";
import DailyPrayers from "../models/dailyPrayers";

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

prayerStatusesRouter.get('',
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