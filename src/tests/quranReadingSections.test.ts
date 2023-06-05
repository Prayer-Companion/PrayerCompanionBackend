import {describe, expect, test} from '@jest/globals';

import {getQuranReadingSections} from "../routes/quranReadingSections";

describe('getQuranReadingSections', () => {

    test('1 section, 1 surah that is shorter than numberOfCharsInSection', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            1,
            170,
            170 / 4
        )

        const expected = [{
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah that is equal to numberOfCharsInSection', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            1,
            167,
            167 / 4
        )

        const expected = [{
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah that is longer than numberOfCharsInSection', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            1,
            150,
            150 / 4
        )

        const expected = [{
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah that contains only one aya', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 1},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            1,
            170,
            170 / 4
        )

        const expected = [{
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah from the middle', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 3, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            1,
            170,
            170 / 4
        )

        const expected = [{
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })


    test('2 sections, 1 surah that is shorter than numberOfCharsInSection', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            2,
            170,
            170 / 4
        )


        const expected = Array(2).fill({
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        })

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 1 surah that is equal to numberOfCharsInSection', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            2,
            167,
            167 / 4
        )


        const expected = Array(2).fill({
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        })

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 1 surah that is longer than numberOfCharsInSection', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            2,
            150,
            150 / 4
        )


        const expected = Array(2).fill({
            "surahId": prayerSurahAyat[0].surahId,
            "startAya": prayerSurahAyat[0].startAya,
            "endAya": prayerSurahAyat[0].endAya
        })

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 2 suar (both start from aya 1)', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
            {userId: 1, surahId: 2, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            2,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": prayerSurahAyat[0].surahId,
                "startAya": prayerSurahAyat[0].startAya,
                "endAya": prayerSurahAyat[0].endAya
            },
            {
                "surahId": prayerSurahAyat[1].surahId,
                "startAya": prayerSurahAyat[1].startAya,
                "endAya": 4
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 2 suar (both start from aya 3)', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 3, endAya: 7},
            {userId: 1, surahId: 2, startAya: 3, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            2,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": prayerSurahAyat[0].surahId,
                "startAya": prayerSurahAyat[0].startAya,
                "endAya": prayerSurahAyat[0].endAya
            },
            {
                "surahId": prayerSurahAyat[1].surahId,
                "startAya": prayerSurahAyat[1].startAya,
                "endAya": 5
            }
        ]

        expect(actual).toStrictEqual(expected)
    })


    test('3 sections, 3 suar (all start from aya 1)', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
            {userId: 1, surahId: 2, startAya: 1, endAya: 4},
            {userId: 1, surahId: 7, startAya: 1, endAya: 10},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            3,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": prayerSurahAyat[0].surahId,
                "startAya": prayerSurahAyat[0].startAya,
                "endAya": prayerSurahAyat[0].endAya
            },
            {
                "surahId": prayerSurahAyat[1].surahId,
                "startAya": prayerSurahAyat[1].startAya,
                "endAya": 4
            },
            {
                "surahId": prayerSurahAyat[2].surahId,
                "startAya": prayerSurahAyat[2].startAya,
                "endAya": 3
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

    test('3 sections, 3 suar (start from 1 , 1 , 4)', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
            {userId: 1, surahId: 2, startAya: 1, endAya: 4},
            {userId: 1, surahId: 7, startAya: 4, endAya: 10},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            3,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": prayerSurahAyat[0].surahId,
                "startAya": prayerSurahAyat[0].startAya,
                "endAya": prayerSurahAyat[0].endAya
            },
            {
                "surahId": prayerSurahAyat[1].surahId,
                "startAya": prayerSurahAyat[1].startAya,
                "endAya": 4
            },
            {
                "surahId": prayerSurahAyat[2].surahId,
                "startAya": prayerSurahAyat[2].startAya,
                "endAya": 7
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

    test('3 sections, 3 suar (start from 2 , 3 , 4)', () => {
        const prayerSurahAyat = [
            {userId: 1, surahId: 1, startAya: 2, endAya: 7},
            {userId: 1, surahId: 2, startAya: 3, endAya: 5},
            {userId: 1, surahId: 7, startAya: 4, endAya: 10},
        ]

        const actual = getQuranReadingSections(
            prayerSurahAyat,
            3,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": prayerSurahAyat[0].surahId,
                "startAya": prayerSurahAyat[0].startAya,
                "endAya": prayerSurahAyat[0].endAya
            },
            {
                "surahId": prayerSurahAyat[1].surahId,
                "startAya": prayerSurahAyat[1].startAya,
                "endAya": 5
            },
            {
                "surahId": prayerSurahAyat[2].surahId,
                "startAya": prayerSurahAyat[2].startAya,
                "endAya": 7
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

})