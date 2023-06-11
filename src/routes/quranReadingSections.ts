import {Router} from "express";
import {MemorizedSurahAyat} from "@prisma/client";
import SurahUtils from "../utils/surahUtils";
import {StatusCodes} from "http-status-codes";
import {findClosestNumberIndex, getElementAt, shuffleArray} from "../utils/arrayUtils";

export const quranReadingSectionsRouter = Router()

quranReadingSectionsRouter.get(
    '',
    async (req, res) => {

        const userId = req.userId

        let queryResult: MemorizedSurahAyat[]

        try {
            queryResult = await prisma.memorizedSurahAyat.findMany({
                where: {userId: userId}
            })
        } catch (e) {
            console.log(e)
            return res.status(StatusCodes.BAD_REQUEST).json("Something went wrong during fetching quranReadingSection")
        }


        //Remove Al-Fatiha
        const alFatihaIndex = queryResult.findIndex(value => value.surahId = 1)

        if (alFatihaIndex >= 0) {
            queryResult.splice(alFatihaIndex, 1)
        }

        const userSuarShuffled = shuffleArray(queryResult)

        const result = getQuranReadingSections(userSuarShuffled)

        res.json(result)
    })


export function getQuranReadingSections(
    memorizedSurahAyat: MemorizedSurahAyat[],
    numberOfSections = 20,
    numberOfCharsInSection = 170,
    thresholdRemaining = numberOfCharsInSection / 2,
    thresholdClosestNumber = numberOfCharsInSection / 3,
) {
    const createSection = (surahId: number, sectionStartIndex: number, sectionEndIndex: number) => ({
        'surahId': surahPart.surahId,
        'startAya': sectionStartIndex + 1,
        'endAya': sectionEndIndex + 1,
    })

    // Get next surah from the array in circular fashion
    const getNextSurah = (surahArray: MemorizedSurahAyat[], index: number) => surahArray[index % surahArray.length];

    // Reset variables for next iteration
    const resetVariables = (surahArray: MemorizedSurahAyat[], index: number) => {
        const surahPart = getNextSurah(surahArray, index);
        const sectionStartIndex = surahPart.startAya - 1;
        return {surahPart, sectionStartIndex};
    }

    if (memorizedSurahAyat.length == 0) {
        return []
    }

    let sections = [];
    let arrayIndex = 0;
    let {surahPart, sectionStartIndex} = resetVariables(memorizedSurahAyat, arrayIndex);

    while (sections.length < numberOfSections) {
        const surahPrefixSum = SurahUtils.getSurahPrefixSum(surahPart.surahId);
        const closestNumber = numberOfCharsInSection + getElementAt(surahPrefixSum, sectionStartIndex - 1, 0)

        let sectionEndIndex = findClosestNumberIndex(
            surahPrefixSum,
            closestNumber,
            sectionStartIndex,
            surahPart.endAya
        );

        const searchResult = surahPrefixSum[sectionEndIndex]

        if (searchResult < closestNumber && closestNumber - searchResult < thresholdClosestNumber && sectionEndIndex + 1 < surahPart.endAya) {
            sectionEndIndex++
        }

        let remainingChars = surahPrefixSum[surahPart.endAya - 1] - surahPrefixSum[sectionEndIndex];

        // If remaining characters are below the threshold, use all remaining characters
        if (remainingChars > 0 && remainingChars <= thresholdRemaining) {
            sectionEndIndex = surahPart.endAya - 1;
            remainingChars = 0;
        }

        sections.push(createSection(surahPart.surahId, sectionStartIndex, sectionEndIndex))

        // If there are remaining characters, continue in current Surah
        if (remainingChars > 0) {
            sectionStartIndex = sectionEndIndex + 1;
        } else { // Otherwise, reset to start with the next Surah
            arrayIndex++;
            ({surahPart, sectionStartIndex} = resetVariables(memorizedSurahAyat, arrayIndex));
        }
    }

    return sections;
}





