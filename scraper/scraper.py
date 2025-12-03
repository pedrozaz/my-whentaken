import requests
import json
import random
import time
import os

USER_AGENT = "WhenTakenGameBot (github.com/pedrozaz)"
OUTPUT_FILE = "rounds_data.json"
MIN_YEAR = 1900
MAX_YEAR = 2025

CATEGORIES = [
    "Category:Featured_pictures_of_monuments_and_memorials",
    "Category:Featured_pictures_of_castles",
    "Category:Featured_pictures_of_churches",
    "Category:Featured_pictures_of_palaces",
    "Category:Quality_images_of_monuments_and_memorials",
    "Category:Quality_images_of_castles",
    "Category:Quality_images_of_historical_buildings",
    "Category:Images_from_Wiki_Loves_Monuments_2023",
    "Category:Images_from_Wiki_Loves_Monuments_2024",
    "Category:World_Heritage_Sites",
    "Category:Historical_images_of_buildings",
    "Category:Ancient_architecture",
    "Category:Medieval_architecture"
]

def fetch_category_images(category, limit=10):
    print(f"Searching for {category}...")
    url = "https://commons.wikimedia.org/w/api.php"

    params = {
        "action": "query",
        "generator": "categorymembers",
        "gcmtitle": category,
        "gcmtype": "file",
        "gcmlimit": limit,
        "prop": "imageinfo|categories",
        "gcmtype": "file",
        "iiprop": "url|extmetadata|size",
        "iiurlwidth": "1024",
        "format": "json"
    }

    headers = {"User-Agent": USER_AGENT}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        data = response.json()

        if "query" not in data or "pages" not in data["query"]:
            print(f"No results found for {category}")
            return []

        return data["query"]["pages"].values()
    except Exception as e:
        print(f"Error fetching {category}: {e}")
        return []

def parse_year(date_str):
    if not date_str: return None
    try:
        year = int(date_str[:4])
        return year
    except:
        return None

def process_images():
    valid_rounds = []
    seen_urls = set()

    print(f"Fetching {len(CATEGORIES)} categories...")

    for category in CATEGORIES:
        pages = fetch_category_images(category, limit=60)

        for page in pages:
            if "imageinfo" not in page: continue

            info = page["imageinfo"][0]
            meta = info.get("extmetadata", {})
            url = info.get("url")

            if url in seen_urls: continue

            date_original = meta.get("DateTimeOriginal", {}).get("value")
            lat_data = meta.get("GPSLatitude", {}).get("value")
            lon_data = meta.get("GPSLongitude", {}).get("value")

            if not (date_original and lat_data and lon_data):
                continue

            year = parse_year(date_original)
            if not year or not (MIN_YEAR <= year <= MAX_YEAR):
                continue

            try:
                lat = float(lat_data)
                lon = float(lon_data)

                if abs(lat) < 0.01 and abs(lon) < 0.01:
                    continue

                round_data = {
                    "imageUrl": url,
                    "lat": lat,
                    "lon": lon,
                    "year": year,
                    "source": "Wikimedia Commons",
                    "license": meta.get("LicenseShortName", {}).get("value", "Unknown")
                }

                valid_rounds.append(round_data)
                seen_urls.add(url)
                print(f"[OK] {year} | Lat: {lat:.2f} | {url.split('/')[-1][:30]}...")

            except ValueError:
                continue

        time.sleep(1)

    print(f"Process finished")
    print(f"Valid images: {len(valid_rounds)}")

    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(valid_rounds, f, indent=2, ensure_ascii=False)
        print(f"Wrote to {OUTPUT_FILE}")
    except Exception as e:
        print(f"Error writing to {OUTPUT_FILE}: {e}")

if __name__ == "__main__":
    process_images()

