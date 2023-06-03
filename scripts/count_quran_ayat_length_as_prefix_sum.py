import re
import itertools
import json

suar = [[] for _ in range(114)]
suar_prefix_sum = [[] for _ in range(114)]

with open('quran.txt', encoding='utf-8') as file:
    while line := file.readline():
        # Meta data
        splitLine = line.split("|")
        suraIndex = int(splitLine[0]) - 1
        ayaIndex = int(splitLine[1]) - 1

        line = re.sub(r'[^ءأ-ي آ]', '', line)

        ayaLength = len(line)
        suar[suraIndex].append(ayaLength)

    suar_prefix_sum = suar.copy()

    for i in range(len(suar_prefix_sum)):

        suar_prefix_sum[i] = list(itertools.accumulate(suar_prefix_sum[i]))

    with open('output.json', 'w') as file:
        # file.write(','.join(suar_prefix_sum))
        json.dump(suar_prefix_sum, file)
