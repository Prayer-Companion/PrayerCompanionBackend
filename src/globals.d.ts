import {auth} from "firebase-admin";
import {PrismaClient} from '@prisma/client'

declare global {

    var appRoot: string;

    var prisma: PrismaClient

    import DecodedIdToken = auth.DecodedIdToken;

    namespace Express {
        interface Request {
            userId: number
            decodedIdToken: DecodedIdToken
        }
    }

}