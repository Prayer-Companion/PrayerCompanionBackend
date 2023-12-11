import {Request, Router} from "express";
import {header, query, validationResult} from "express-validator";
import {PrayerNames, PrayerStatuses} from "@prisma/client";
import {ParamsDictionary} from "express-serve-static-core";
import {StatusCodes} from "http-status-codes";
import moment from "moment-timezone";
import {validateDateTime, validateTimeZone} from "../customValidators";

export const prayerStatusRouter = Router()

const dateFormat = 'DD/MM/YYYY'

prayerStatusRouter.put(
    '',
    header('timeZone').custom(validateTimeZone),
    query('date').custom( validateDateTime),
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
            timeZone: string
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