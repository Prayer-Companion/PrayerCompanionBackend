type LoopBetweenDatesFunction = (date: Date) => void

export function loopBetweenDates(
    start: { date: Date, inclusive: boolean },
    end: { date: Date, inclusive: boolean },
    forEach: LoopBetweenDatesFunction
) {
    let date = new Date(start.date)
    const endDate = new Date(end.date)

    if (!start.inclusive) {
        date.setDate(date.getDate() + 1)
    }

    if (!end.inclusive) {
        endDate.setDate(endDate.getDate() - 1)
    }

    for (; date <= endDate; date.setDate(date.getDate() + 1)) {
        forEach(date)
    }
}

export function daysBetween(start: Date, end: Date) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000

    return Math.round((end.getTime() - start.getTime()) / millisecondsPerDay)
}