import {NextFunction, Response, Request} from "express";

import {StatusCodes} from "http-status-codes";

export const verifyUserCreated = async (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/v1/user/signIn' || req.path.startsWith('/public/')) {
        return next()
    }

    try {
        const firebaseUid = req.decodedIdToken.uid

        const user = await prisma.user.findUnique({
            where: {
                firebaseId: firebaseUid
            }
        })

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json("User doesn't exist in the database")
        }

        req.userId = user.id
        return next()

    } catch (e) {
        console.log(e)
        return res.status(StatusCodes.BAD_REQUEST).json("Something went wrong during user checking")
    }

}

