import {Router} from "express";
import {PrayerSurahAyat, PrismaClient} from "@prisma/client";
import SurahUtils from "../utils/surahUtils";
import {StatusCodes} from "http-status-codes";
import {findClosestNumberIndex, getElementAt, shuffleArray} from "../utils/arrayUtils";

export const quranReadingSectionsRouter = Router()

const prisma = new PrismaClient()

quranReadingSectionsRouter.get(
    '',
    async (req, res) => {

        const userId = req.userId

        let queryResult: PrayerSurahAyat[]

        try {
            queryResult = await prisma.prayerSurahAyat.findMany({
                where: {userId: userId}
            })
        } catch (e) {
            console.log(e)
            return res.status(StatusCodes.BAD_REQUEST).json("Something went wrong during fetching quranReadingSection")
        }

        const userSuarShuffled = shuffleArray(queryResult)

        const result = getQuranReadingSections(
            userSuarShuffled,
            3,
            170,
            170 / 4
        )

        res.json(result)
    })


export function getQuranReadingSections(
    prayerSurahAyat: PrayerSurahAyat[],
    numberOfSections = 6,
    numberOfCharsInSection = 170,
    thresholdRemaining = numberOfCharsInSection / 4
) {
    const createSection = (surahId: number, sectionStartIndex: number, sectionEndIndex: number) => ({
        'surahId': surahPart.surahId,
        'startAya': sectionStartIndex + 1,
        'endAya': sectionEndIndex + 1,
    })

    // Get next surah from the array in circular fashion
    const getNextSurah = (surahArray: PrayerSurahAyat[], index: number) => surahArray[index % surahArray.length];

    // Reset variables for next iteration
    const resetVariables = (surahArray: PrayerSurahAyat[], index: number) => {
        const surahPart = getNextSurah(surahArray, index);
        const sectionStartIndex = surahPart.startAya - 1;
        return {surahPart, sectionStartIndex};
    }

    let sections = [];
    let arrayIndex = 0;
    let {surahPart, sectionStartIndex} = resetVariables(prayerSurahAyat, arrayIndex);

    while (sections.length < numberOfSections) {
        const surahPrefixSum = SurahUtils.getSurahPrefixSum(surahPart.surahId);
        const closestNumber = numberOfCharsInSection + getElementAt(surahPrefixSum, sectionStartIndex - 1, 0)

        let sectionEndIndex = findClosestNumberIndex(
            surahPrefixSum,
            closestNumber,
            sectionStartIndex,
            surahPart.endAya
        );

        let remainingChars = surahPrefixSum[surahPart.endAya - 1] - surahPrefixSum[sectionEndIndex];

        // If remaining characters are below the threshold, use all remaining characters
        if (remainingChars > 0 && remainingChars <= thresholdRemaining) {
            sectionEndIndex = Math.min(surahPart.endAya) - 1;
            remainingChars = 0;
        }

        sections.push(createSection(surahPart.surahId, sectionStartIndex, sectionEndIndex))

        // If there are remaining characters, continue in current Surah
        if (remainingChars > 0) {
            sectionStartIndex = sectionEndIndex + 1;
            console.log("a7a", closestNumber)
        } else { // Otherwise, reset to start with the next Surah
            arrayIndex++;
            ({surahPart, sectionStartIndex} = resetVariables(prayerSurahAyat, arrayIndex));
        }
    }

    return sections;
}




