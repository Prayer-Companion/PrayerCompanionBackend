import os
import csv
import datetime

# directory containing CSV files
directory = 'prayerTimes'

for filename in os.listdir(directory):
    if filename.endswith(".csv"):
        with open(os.path.join(directory, filename), 'r') as f:
            reader = csv.reader(f)
            data = []

            # process each line
            for row in reader:
                # change the date format from M/D/YYYY to DD/MM/YYYY
                dt = datetime.datetime.strptime(row[0], '%d/%m/%Y')
                row[0] = dt.strftime('%d/%m/%Y')

                data.append(row)

        # write the processed data to a new csv file
        with open(os.path.join(directory, 'processed_' + filename), 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(data)

