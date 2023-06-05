export function getElementAt<T>(array: T[], index: number, defaultValue: T): T {
    const result = array[index]

    if (result != null) {
        return result
    }

    return defaultValue
}


/**
 * Shuffle an array using Fisher–Yates algorithm.
 *
 * Time complexity: O(n)
 */
export function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]; // Creates a copy to avoid mutating the original array
    let m = arr.length;

    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element
        const i = Math.floor(Math.random() * m--);

        // Swap it with the current element
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }

    return arr;
}

/**
 * Get the index of the element that is equal or most close to `x`
 * Note: `arr` must be sorted
 *
 * Time complexity: O(log n)
 */
export function findClosestNumberIndex(arr: number[], x: number, start?: number, end?: number): number {
    const getClosestIndex = (idx1: number, idx2: number) => Math.abs(x - arr[idx1]) > Math.abs(arr[idx2] - x) ? idx2 : idx1;

    let left = start != null ? start : 0;
    let right = end != null ? end - 1 : arr.length - 1;
    let mid = 0;

    if (x <= arr[left]) return left; // If x is less than the first element, return the first element index
    if (x >= arr[right]) return right; // If x is greater than the last element, return the last element index

    // Binary search
    while (left < right) {
        mid = Math.floor((left + right) / 2);

        if (arr[mid] == x) return mid;

        if (mid > 0 && arr[mid - 1] <= x && x < arr[mid])
            return getClosestIndex(mid - 1, mid);

        if (mid < right && arr[mid] < x && x <= arr[mid + 1])
            return getClosestIndex(mid, mid + 1);

        if (arr[mid] < x) left = mid + 1;

        else right = mid - 1;
    }

    // Single element left after search
    return mid;
}

