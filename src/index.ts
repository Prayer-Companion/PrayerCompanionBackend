import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {prayerTimesRouter} from './routes/prayerTimes';
import * as https from "https";
import * as fs from "fs";
import * as http from "http";
import path from "path";

dotenv.config();

const rootPath = path.join(__dirname, '..')

const app: Express = express();
const httpsPort = process.env.HTTPS_PORT;
const httpPort = process.env.HTTP_PORT;

app.use(express.static(path.join(rootPath, 'static'), {dotfiles: 'allow'}))

console.log(path.join(rootPath, 'static'))

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/v1', prayerTimesRouter)

http.createServer(app).listen(80, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${httpPort}`);
})

// https.createServer(
//     {
//         key: fs.readFileSync(path.join(rootPath, '/etc/letsencrypt/path/to/key.pem')),
//         cert: fs.readFileSync(path.join(rootPath, '/etc/letsencrypt/path/to/cert.pem')),
//         ca: fs.readFileSync(path.join(rootPath, '/etc/letsencrypt/path/to/chain.pem')),
//     },
//     app
// ).listen(httpsPort, () => {
//         console.log(`⚡️[server]: Server is running at https://localhost:${httpsPort}`);
//     }
// )