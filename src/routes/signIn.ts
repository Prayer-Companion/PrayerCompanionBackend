import {Router} from "express";
import {StatusCodes} from "http-status-codes";

export const signInRouter = Router()

signInRouter.put('', async (req, res) => {
    try {
        await prisma.user.upsert({
            where: {
                firebaseId: req.decodedIdToken.uid
            },
            create: {
                firebaseId: req.decodedIdToken.uid,
            },
            update: {},
        })

        return res.json("Done")
    } catch (e) {
        console.log(e)
        return res.status(StatusCodes.BAD_REQUEST).json('Something went wrong during singing-in')
    }
})