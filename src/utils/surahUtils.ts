const surahAyatPrefixSum: number[][] = require('../../rawData/quran_ayat_length_as_prefix_sum.json')

export default class SurahUtils {
    public static getSurahPrefixSum(surahId: number) {
        return surahAyatPrefixSum[surahId - 1]
    }

    public static getNumberOfAyatInSurah(surahId: number) {
        return SurahUtils.getSurahPrefixSum(surahId).length
    }

    public static getNumberOfCharsInAya(surahId: number, ayaNumber: number) {
        return SurahUtils.getSurahPrefixSum(surahId)[ayaNumber - 1]
    }

    public static isSurahIdValid(surahId: number) {
        return surahId >= 1 && surahId <= 114
    }

    public static isAyaNumberValid(surahId: number, ayaNumber: number) {
        return 1 <= ayaNumber && ayaNumber <= SurahUtils.getNumberOfAyatInSurah(surahId)
    }

    public static isAyaStartEndNumbersValid(surahId: number, startAyaNumber: number, endAyaNumber: number) {
        return (
            SurahUtils.isAyaNumberValid(surahId, startAyaNumber) &&
            SurahUtils.isAyaNumberValid(surahId, endAyaNumber) &&
            startAyaNumber <= endAyaNumber
        )
    }


}
