import {describe, test} from '@jest/globals';

import {findClosestNumberIndex} from "../utils/arrayUtils";

describe('findClosestNumberIndex', () => {

    test('Positive numbers', () => {
        const arr = [1, 2, 3, 4, 5];
        expect(findClosestNumberIndex(arr, 0)).toBe(0)
        expect(findClosestNumberIndex(arr, 2.5)).toBe(1)
        expect(findClosestNumberIndex(arr, 6)).toBe(4)
    })

    test('Negative numbers', () => {
        const arr = [-5, -4, -3, -2, -1]
        expect(findClosestNumberIndex(arr, -6)).toBe(0)
        expect(findClosestNumberIndex(arr, -1.5)).toBe(3)
        expect(findClosestNumberIndex(arr, 0)).toBe(4)
    })

    test('Both positive and negative numbers', () => {
        const arr = [-3, -2, -1, 0, 1, 2, 3]
        expect(findClosestNumberIndex(arr, -4)).toBe(0)
        expect(findClosestNumberIndex(arr, 2.5)).toBe(5)
        expect(findClosestNumberIndex(arr, 4)).toBe(6)
    })

    test('A single number', () => {
        const arr = [0]
        expect(findClosestNumberIndex(arr, -1)).toBe(0)
        expect(findClosestNumberIndex(arr, 1)).toBe(0)
        expect(findClosestNumberIndex(arr, 170, 0, 1)).toBe(0)
    })

    test('Two numbers', () => {
        const arr = [0, 1]
        expect(findClosestNumberIndex(arr, -1)).toBe(0)
        expect(findClosestNumberIndex(arr, 2)).toBe(1)
    })
})