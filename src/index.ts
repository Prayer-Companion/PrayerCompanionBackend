import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {prayerTimesRouter} from './routes/prayerTimes';
import {prayerStatusesRouter} from "./routes/prayerStatuses";
import {verifyIdToken} from "./middlewares/verifyToken";
import {signInRouter} from "./routes/signIn";
import {verifyUserCreated} from "./middlewares/verifyUserCreated";
import path from 'path'
import {memorizedSurahAyatRouter} from "./routes/memorizedSurahAyat";
import {queryParser} from "express-query-parser";
import {quranReadingSectionsRouter} from "./routes/quranReadingSections";
import {prayerStatusRouter} from "./routes/prayerStatus";
import {dev} from "./middlewares/dev";
import {PrismaClient} from "@prisma/client";

//Envs
dotenv.config();
const port = process.env.PORT;
const isDevelopment = process.env.NODE_ENV == 'dev';

//Globals
global.appRoot = path.resolve('./')
global.prisma = new PrismaClient()


const app: Express = express();

//Query parser
app.use(queryParser({parseNull: true, parseUndefined: true, parseBoolean: true, parseNumber: true,}))

//Authentication
if (isDevelopment) {
    console.log("============== Dev Environment ==============")
    app.use(dev)
} else {
    app.use(verifyIdToken)
}

app.use(verifyUserCreated)

//Routes
app.use('/v1/user/signIn', signInRouter)
app.use('/v1/prayerTimes', prayerTimesRouter)
app.use('/v1/user/prayerStatus', prayerStatusRouter)
app.use('/v1/user/prayerStatuses', prayerStatusesRouter)
app.use('/v1/user/memorizedSurahAyat', memorizedSurahAyatRouter)
app.use('/v1/user/quranReadingSections', quranReadingSectionsRouter)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})