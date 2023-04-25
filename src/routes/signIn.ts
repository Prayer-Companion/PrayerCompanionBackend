import {Router} from "express";
import {PrismaClient} from "@prisma/client";

export const signInRouter = Router()

const prisma = new PrismaClient()

signInRouter.put('/user/signIn', (req, res) => {
    prisma.user.upsert({
        where: {
            firebaseId: req.decodedIdToken.uid
        },
        create: {
            firebaseId: req.decodedIdToken.uid,
        },
        update: {},
    })

    return res.json("Done")
})