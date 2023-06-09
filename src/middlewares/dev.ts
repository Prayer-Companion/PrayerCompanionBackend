import {NextFunction, Request, Response} from "express";

export const dev = async (req: Request, res: Response, next: NextFunction) => {
    req.userId = 1
    req.decodedIdToken = {
        uid: '111',

        //Ignore them
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {identities: {}, sign_in_provider: ""},
        iat: 0,
        iss: "",
        sub: "",
    }
    next()
}