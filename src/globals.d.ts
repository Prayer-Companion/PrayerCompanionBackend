import {auth} from "firebase-admin";

declare global {

    import DecodedIdToken = auth.DecodedIdToken;

    namespace Express {
        interface Request {
            userId: number
            decodedIdToken: DecodedIdToken
        }
    }

}

export {}