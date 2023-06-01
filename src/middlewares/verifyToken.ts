import {NextFunction, Response, Request} from "express";

import fire from "../firebaseAdmin";
import {StatusCodes} from "http-status-codes";

export const verifyIdToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromRequestHeader(req)

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json("Add a bearer token to the authorization header")
    }

    try {
        req.decodedIdToken = await fire.auth().verifyIdToken(token)
        return next()
    } catch (e) {
        return res.status(StatusCodes.UNAUTHORIZED).json("Invalid token, Please sign-in")
    }
}

const getTokenFromRequestHeader = (req: Request) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) return null;

    return token.substring(7);
}