import pandas as pd
import os

# CSV files
csv_files = [
    "Amman.csv", "Aqaba.csv", "Tafilah.csv", "Jerash.csv", 
    "Ajloun.csv", "Ma'an.csv", "Irbid.csv", "Zarqa.csv",
    "Mafraq.csv", "Balqa.csv", "Karak.csv", "Madaba.csv"
]

# Names of the columns to be checked
cols_to_check = ["dhuhr", "asr", "maghrib", "isha"]

def convert_to_pm(time_str):
    # Convert time from AM (in 24-hour format) to PM
    h, m = map(int, time_str.split(':'))
    return f"{h + 12 if 0 < h < 12 else h}:{m:02d}"

for file_name in csv_files:
    # Check if file exists
    if not os.path.isfile(file_name):
        print(f"File {file_name} not found. Skipping.")
        continue
    
    df = pd.read_csv(file_name)
    
    for col in cols_to_check:
        if col in df.columns:
            # Apply the function to convert time from AM to PM
            df[col] = df[col].apply(convert_to_pm)
    
    # Write the modified DataFrame back to the CSV file
    df.to_csv(file_name, index=False)

print("All files processed.")