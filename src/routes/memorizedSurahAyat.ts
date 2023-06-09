import {Request, Router} from "express";
import {PrismaClient} from "@prisma/client";
import {query, validationResult} from "express-validator";
import {StatusCodes} from "http-status-codes";
import SurahUtils from "../utils/surahUtils";
import {ParamsDictionary} from "express-serve-static-core";

const prisma = new PrismaClient()

export const memorizedSurahAyatRouter = Router()

memorizedSurahAyatRouter.get(
    '',
    async (req, res) => {

        const userId = req.userId

        try {
            const queryResult = await prisma.memorizedSurahAyat.findMany(
                {
                    where: {
                        userId: userId
                    }
                }
            )

            const result = queryResult.map(value => {
                return {
                    'surahId': value.surahId,
                    'startAya': value.startAya,
                    'endAya': value.endAya,
                }
            })

            return res.json(result)
        } catch (e) {
            console.log(e)
            return res.status(StatusCodes.BAD_REQUEST).json("Something went wrong during fetching memorizedSurahAyat")
        }

    }
)

memorizedSurahAyatRouter.put(
    '',
    query('surahId').custom(async surahId => {
        if (SurahUtils.isSurahIdValid(surahId)) return

        throw 'invalid value, surahId must be between [1 - 114]'
    }),
    async (
        req: Request<ParamsDictionary, any, any, {
            surahId: number
            startAya: number,
            endAya: number
        }>,
        res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()})
        }

        const q = req.query

        if (!SurahUtils.isAyaStartEndNumbersValid(q.surahId, q.startAya, q.endAya)) {
            return res.status(StatusCodes.BAD_REQUEST).json("startAya must be smaller than endAya and both of them must be <= surah length")
        }

        const userId = req.userId

        try {
            const memorizedSurahAyat = await prisma.memorizedSurahAyat.upsert({
                where: {
                    userId_surahId: {
                        userId: userId,
                        surahId: q.surahId
                    }
                },
                create: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    surahId: q.surahId,
                    startAya: q.startAya,
                    endAya: q.endAya,
                },
                update: {
                    startAya: q.startAya,
                    endAya: q.endAya,
                },
            })

            return res.json(memorizedSurahAyat)
        } catch (e) {
            console.log(e)
            return res.status(StatusCodes.BAD_REQUEST).json("Something went wrong during updating memorizedSurahAyat")
        }

    }
)

memorizedSurahAyatRouter.delete(
    '',
    query('surahId').custom(async surahId => {
        if (SurahUtils.isSurahIdValid(surahId)) return

        throw 'invalid value, surahId must be between [1 - 114]'
    }),
    async (
        req: Request<ParamsDictionary, any, any, { surahId: number }>,
        res
    ) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()})
        }

        const userId = req.userId

        try {
            const result = await prisma.memorizedSurahAyat.delete({
                where: {
                    userId_surahId: {
                        userId: userId,
                        surahId: req.query.surahId
                    }
                }
            })
            return res.json(result)
        } catch (e) {
            console.log(e)
            return res.status(StatusCodes.BAD_REQUEST).json("Something went wrong during deleting memorizedSurahAyat")
        }
    }
)