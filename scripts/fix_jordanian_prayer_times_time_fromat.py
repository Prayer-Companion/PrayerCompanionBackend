import pandas as pd
import glob

# Get list of all csv files in the folder
csv_files = glob.glob('JO/*.csv')

# Loop over the files and process each one
for filename in csv_files:
    # Read the csv file
    df = pd.read_csv(filename, header=None)

    # Apply the time format conversion to all columns except the first one (date)
    for i in range(1, df.shape[1]):
        df[i] = pd.to_datetime(df[i], format='%H:%M').dt.strftime('%H:%M')

    # Overwrite the original file with the formatted data
    df.to_csv(filename, header=None, index=False)