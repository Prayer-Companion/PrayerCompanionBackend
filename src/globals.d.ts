import {auth} from "firebase-admin";

declare global {

    import DecodedIdToken = auth.DecodedIdToken;

    namespace Express {
        interface Request {
            decodedIdToken: DecodedIdToken
        }
    }

}

export {}