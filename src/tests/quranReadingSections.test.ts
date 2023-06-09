import {describe, expect, test} from '@jest/globals';

import {getQuranReadingSections} from "../routes/quranReadingSections";

describe('getQuranReadingSections', () => {

    test('1 section, 1 surah that is shorter than numberOfCharsInSection', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            1,
            170,
            170 / 4
        )

        const expected = [{
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah that is equal to numberOfCharsInSection', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            1,
            167,
            167 / 4
        )

        const expected = [{
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah that is longer than numberOfCharsInSection', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            1,
            150,
            150 / 4
        )

        const expected = [{
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah that contains only one aya', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 1},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            1,
            170,
            170 / 4
        )

        const expected = [{
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })

    test('1 section, 1 surah from the middle', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 3, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            1,
            170,
            170 / 4
        )

        const expected = [{
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        }]

        expect(actual).toStrictEqual(expected)
    })


    test('2 sections, 1 surah that is shorter than numberOfCharsInSection', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            2,
            170,
            170 / 4
        )


        const expected = Array(2).fill({
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        })

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 1 surah that is equal to numberOfCharsInSection', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            2,
            167,
            167 / 4
        )


        const expected = Array(2).fill({
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        })

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 1 surah that is longer than numberOfCharsInSection', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            2,
            150,
            150 / 4
        )


        const expected = Array(2).fill({
            "surahId": memorizedSurahAyat[0].surahId,
            "startAya": memorizedSurahAyat[0].startAya,
            "endAya": memorizedSurahAyat[0].endAya
        })

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 2 suar (both start from aya 1)', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
            {userId: 1, surahId: 2, startAya: 1, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            2,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": memorizedSurahAyat[0].surahId,
                "startAya": memorizedSurahAyat[0].startAya,
                "endAya": memorizedSurahAyat[0].endAya
            },
            {
                "surahId": memorizedSurahAyat[1].surahId,
                "startAya": memorizedSurahAyat[1].startAya,
                "endAya": 4
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

    test('2 sections, 2 suar (both start from aya 3)', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 3, endAya: 7},
            {userId: 1, surahId: 2, startAya: 3, endAya: 7},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            2,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": memorizedSurahAyat[0].surahId,
                "startAya": memorizedSurahAyat[0].startAya,
                "endAya": memorizedSurahAyat[0].endAya
            },
            {
                "surahId": memorizedSurahAyat[1].surahId,
                "startAya": memorizedSurahAyat[1].startAya,
                "endAya": 5
            }
        ]

        expect(actual).toStrictEqual(expected)
    })


    test('3 sections, 3 suar (all start from aya 1)', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
            {userId: 1, surahId: 2, startAya: 1, endAya: 4},
            {userId: 1, surahId: 7, startAya: 1, endAya: 10},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            3,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": memorizedSurahAyat[0].surahId,
                "startAya": memorizedSurahAyat[0].startAya,
                "endAya": memorizedSurahAyat[0].endAya
            },
            {
                "surahId": memorizedSurahAyat[1].surahId,
                "startAya": memorizedSurahAyat[1].startAya,
                "endAya": 4
            },
            {
                "surahId": memorizedSurahAyat[2].surahId,
                "startAya": memorizedSurahAyat[2].startAya,
                "endAya": 3
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

    test('3 sections, 3 suar (start from 1 , 1 , 4)', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 1, endAya: 7},
            {userId: 1, surahId: 2, startAya: 1, endAya: 4},
            {userId: 1, surahId: 7, startAya: 4, endAya: 10},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            3,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": memorizedSurahAyat[0].surahId,
                "startAya": memorizedSurahAyat[0].startAya,
                "endAya": memorizedSurahAyat[0].endAya
            },
            {
                "surahId": memorizedSurahAyat[1].surahId,
                "startAya": memorizedSurahAyat[1].startAya,
                "endAya": 4
            },
            {
                "surahId": memorizedSurahAyat[2].surahId,
                "startAya": memorizedSurahAyat[2].startAya,
                "endAya": 7
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

    test('3 sections, 3 suar (start from 2 , 3 , 4)', () => {
        const memorizedSurahAyat = [
            {userId: 1, surahId: 1, startAya: 2, endAya: 7},
            {userId: 1, surahId: 2, startAya: 3, endAya: 5},
            {userId: 1, surahId: 7, startAya: 4, endAya: 10},
        ]

        const actual = getQuranReadingSections(
            memorizedSurahAyat,
            3,
            170,
            170 / 4
        )

        const expected = [
            {
                "surahId": memorizedSurahAyat[0].surahId,
                "startAya": memorizedSurahAyat[0].startAya,
                "endAya": memorizedSurahAyat[0].endAya
            },
            {
                "surahId": memorizedSurahAyat[1].surahId,
                "startAya": memorizedSurahAyat[1].startAya,
                "endAya": 5
            },
            {
                "surahId": memorizedSurahAyat[2].surahId,
                "startAya": memorizedSurahAyat[2].startAya,
                "endAya": 7
            }
        ]

        expect(actual).toStrictEqual(expected)
    })

})