import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {prayerTimesRouter} from './routes/prayerTimes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/v1', prayerTimesRouter)

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
})