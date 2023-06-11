import re
import json
import xmltodict

# load the xml file
with open('quran.xml', 'r', encoding='utf-8') as file:
    xml_string = file.read()

# parse the xml string to a python dictionary
data_dict = xmltodict.parse(xml_string)

output = []

for sura in data_dict['quran']['sura']:
    prefix_sum = 0
    sura_prefix_sums = []
    for aya in sura['aya']:
        # apply the regex
        cleaned_text = re.sub('[^ءأ-ي آ]', '', aya['@text'])
        # update the prefix sum
        prefix_sum += len(cleaned_text)
        # append the prefix sum to the sura prefix sums
        sura_prefix_sums.append(prefix_sum)
    # append the sura prefix sums to the output
    output.append(sura_prefix_sums)

# write the output to a json file
with open('output.json', 'w', encoding='utf-8') as file:
    json.dump(output, file, ensure_ascii=False)
