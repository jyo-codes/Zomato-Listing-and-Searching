import pandas as pd
import json
from pymongo import MongoClient
import glob
import os
import chardet

# Paths to the extracted files
base_path = r'C:\Users\Jyothika\OneDrive\Desktop\Zomato\archive (2)'
country_codes_csv_path = os.path.join(base_path, 'Country-Code.csv')
zomato_csv_path = os.path.join(base_path, 'zomato.csv')
json_files_path = glob.glob(os.path.join(base_path, '*.json'))

# Function to detect file encoding
def detect_encoding(file_path):
    with open(file_path, 'rb') as file:
        result = chardet.detect(file.read())
        return result['encoding']

# Detect and load CSV files with the correct encoding
country_codes_encoding = detect_encoding(country_codes_csv_path)
country_codes_df = pd.read_csv(country_codes_csv_path, encoding=country_codes_encoding)

zomato_encoding = detect_encoding(zomato_csv_path)
zomato_restaurants_df = pd.read_csv(zomato_csv_path, encoding=zomato_encoding)

# Load JSON files
json_data = []
for json_file in json_files_path:
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
        if isinstance(data, list):
            json_data.extend(data)
        else:
            json_data.append(data)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['ZOMATO']

# Insert country codes data
country_codes_collection = db['country_codes']
country_codes_data = country_codes_df.to_dict(orient='records')
country_codes_collection.insert_many(country_codes_data)

# Insert Zomato restaurants data
zomato_restaurants_collection = db['zomato_restaurants']
zomato_restaurants_data = zomato_restaurants_df.to_dict(orient='records')
zomato_restaurants_collection.insert_many(zomato_restaurants_data)

# Insert JSON data
json_collection = db['json_data']
json_collection.insert_many(json_data)

print("Data has been successfully uploaded to the ZOMATO database.")
