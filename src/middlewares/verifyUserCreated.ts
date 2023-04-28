import {NextFunction, Response, Request} from "express";

import {PrismaClient} from "@prisma/client";
import {StatusCodes} from "http-status-codes";

const prisma = new PrismaClient()

export const verifyUserCreated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path == '/v1/user/signIn') {
        return next()
    }

    const firebaseUid = req.decodedIdToken.uid

    console.log(`UID: ${firebaseUid}`)

    const user = await prisma.user.findUnique({
        where: {
            firebaseId: firebaseUid
        }
    })

    console.log(`user: ${user?.id}`)

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json("User doesn't exist in the database")
    }

    req.userId = user.id

    return next()
}

