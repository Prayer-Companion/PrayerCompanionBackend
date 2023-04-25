import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {prayerTimesRouter} from './routes/prayerTimes';
import {prayerStatusesRouter} from "./routes/prayerStatuses";
import {verifyIdToken} from "./middlewares/verifyToken";
import {signInRouter} from "./routes/signIn";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use(verifyIdToken)
app.use('/v1', signInRouter)
app.use('/v1', prayerTimesRouter)
app.use('/v1', prayerStatusesRouter)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})