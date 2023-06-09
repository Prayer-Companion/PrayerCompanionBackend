# PrayerCompanionBackend

## Development environments

### Install dependencies
```
npm i
```

### Run the code
```
"concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\""
```

### Generate and apply migrations
```
npx prisma migrate dev
```

### Reset the development database
```
npx prisma migrate reset
```

## Production and testing environments

### Install dependencies
```
npm i
```

## Compiling TypeScript into JavaScript
```
npx tsc
```

### Run the code
```
node dist/index.js
```
or use [pm2](https://www.npmjs.com/package/pm2)
```
pm2 start dist/index.js
```

### Generate and apply migrations
```
npx prisma migrate deploy
```
