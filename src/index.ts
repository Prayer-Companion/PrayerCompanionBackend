import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {prayerTimesRouter} from './routes/prayerTimes';
import * as https from "https";
import * as fs from "fs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static(__dirname + '/static', {dotfiles: 'allow'}))

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/v1', prayerTimesRouter)

https.createServer(
    {
        key: fs.readFileSync('/etc/letsencrypt/path/to/key.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/path/to/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/path/to/chain.pem'),
    },
    app
).listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    }
)