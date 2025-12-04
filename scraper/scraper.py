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
    "Category:Featured_pictures_of_architecture",
    "Category:Featured_pictures_of_castles",
    "Category:Featured_pictures_of_churches",
    "Category:Featured_pictures_of_palaces",
    "Category:Featured_pictures_of_monuments_and_memorials",
    "Category:Featured_pictures_of_religious_buildings",
    "Category:Featured_pictures_of_cathedrals",
    "Category:Featured_pictures_of_mosques",
    "Category:Featured_pictures_of_temples",
    "Category:Featured_pictures_of_towers",
    "Category:Featured_pictures_of_fortifications",
    "Category:Featured_pictures_of_ancient_architecture",
    "Category:Featured_pictures_of_medieval_architecture",
    "Category:Featured_pictures_of_Renaissance_architecture",
    "Category:Featured_pictures_of_Baroque_architecture",
    "Category:Featured_pictures_of_Gothic_architecture",
    "Category:Quality_images_of_architecture",
    "Category:Quality_images_of_castles",
    "Category:Quality_images_of_churches",
    "Category:Quality_images_of_palaces",
    "Category:Quality_images_of_monuments_and_memorials",
    "Category:Quality_images_of_cathedrals",
    "Category:Quality_images_of_mosques",
    "Category:Quality_images_of_temples",
    "Category:Quality_images_of_towers",
    "Category:Quality_images_of_fortifications",
    "Category:Quality_images_of_historical_buildings",
    "Category:Quality_images_of_archaeological_sites",
    "Category:Quality_images_of_city_gates",
    "Category:Quality_images_of_bridges",
    "Category:Quality_images_of_amphitheaters",
    "Category:Quality_images_of_aqueducts",
    "Category:Quality_images_of_ruins",
    "Category:Images_from_Wiki_Loves_Monuments",
    "Category:Images_from_Wiki_Loves_Monuments_2024",
    "Category:Images_from_Wiki_Loves_Monuments_2023",
    "Category:Images_from_Wiki_Loves_Monuments_2022",
    "Category:Images_from_Wiki_Loves_Monuments_2021",
    "Category:World_Heritage_Sites",
    "Category:Cultural_heritage",
    "Category:Cultural_heritage_monuments",
    "Category:Historical_buildings",
    "Category:Historical_monuments",
    "Category:Historical_images_of_buildings",
    "Category:Ancient_architecture",
    "Category:Medieval_architecture",
    "Category:Renaissance_architecture",
    "Category:Baroque_architecture",
    "Category:Gothic_architecture",
    "Category:Romanesque_architecture",
    "Category:Neoclassical_architecture",
    "Category:Archaeological_sites",
    "Category:Ruins",
    "Category:Fortifications",
    "Category:Historic_centers",
    "Category:Castles",
    "Category:Medieval_castles",
    "Category:Fortresses",
    "Category:Forts",
    "Category:City_walls",
    "Category:Fortified_churches",
    "Category:Churches",
    "Category:Cathedrals",
    "Category:Basilicas",
    "Category:Abbeys",
    "Category:Monasteries",
    "Category:Convents",
    "Category:Mosques",
    "Category:Synagogues",
    "Category:Temples",
    "Category:Shrines",
    "Category:Gothic_cathedrals",
    "Category:Palaces",
    "Category:Royal_palaces",
    "Category:Historic_houses",
    "Category:Villas",
    "Category:Mansions",
    "Category:Monuments_and_memorials",
    "Category:War_memorials",
    "Category:Statues",
    "Category:Triumphal_arches",
    "Category:Obelisks",
    "Category:Ancient_Roman_architecture",
    "Category:Ancient_Greek_architecture",
    "Category:Ancient_Egyptian_architecture",
    "Category:Roman_ruins",
    "Category:Greek_ruins",
    "Category:Roman_amphitheaters",
    "Category:Roman_aqueducts",
    "Category:Roman_temples",
    "Category:Greek_temples",
    "Category:Bridges",
    "Category:Historic_bridges",
    "Category:Aqueducts",
    "Category:Amphitheaters",
    "Category:Theaters",
    "Category:Lighthouses",
    "Category:Windmills",
    "Category:Watermills",
    "Category:Castles_in_France",
    "Category:Castles_in_Germany",
    "Category:Castles_in_England",
    "Category:Castles_in_Scotland",
    "Category:Castles_in_Wales",
    "Category:Castles_in_Spain",
    "Category:Castles_in_Italy",
    "Category:Castles_in_Portugal",
    "Category:Castles_in_Poland",
    "Category:Castles_in_Czech_Republic",
    "Category:Castles_in_Austria",
    "Category:Castles_in_Switzerland",
    "Category:Castles_in_Romania",
    "Category:Castles_in_Ireland",
    "Category:Castles_in_Belgium",
    "Category:Castles_in_Netherlands",
    "Category:Castles_in_Hungary",
    "Category:Castles_in_Slovakia",
    "Category:Castles_in_Denmark",
    "Category:Castles_in_Sweden",
    "Category:Castles_in_Norway",
    "Category:Castles_in_Japan",
    "Category:Churches_in_France",
    "Category:Churches_in_Italy",
    "Category:Churches_in_Spain",
    "Category:Churches_in_Germany",
    "Category:Churches_in_Portugal",
    "Category:Churches_in_England",
    "Category:Churches_in_Poland",
    "Category:Churches_in_Austria",
    "Category:Churches_in_Belgium",
    "Category:Churches_in_Netherlands",
    "Category:Churches_in_Czech_Republic",
    "Category:Churches_in_Hungary",
    "Category:Churches_in_Greece",
    "Category:Churches_in_Russia",
    "Category:Churches_in_Brazil",
    "Category:Churches_in_Mexico",
    "Category:Churches_in_Peru",
    "Category:Churches_in_Colombia",
    "Category:Palaces_in_France",
    "Category:Palaces_in_Italy",
    "Category:Palaces_in_Spain",
    "Category:Palaces_in_Russia",
    "Category:Palaces_in_Austria",
    "Category:Palaces_in_Germany",
    "Category:Palaces_in_United_Kingdom",
    "Category:Palaces_in_Portugal",
    "Category:Palaces_in_Poland",
    "Category:Palaces_in_Czech_Republic",
    "Category:Palaces_in_Hungary",
    "Category:Palaces_in_Turkey",
    "Category:Palaces_in_India",
    "Category:Palaces_in_China",
    "Category:Monuments_and_memorials_in_France",
    "Category:Monuments_and_memorials_in_Italy",
    "Category:Monuments_and_memorials_in_Spain",
    "Category:Monuments_and_memorials_in_Germany",
    "Category:Monuments_and_memorials_in_United_States",
    "Category:Monuments_and_memorials_in_United_Kingdom",
    "Category:Monuments_and_memorials_in_Russia",
    "Category:Monuments_and_memorials_in_Brazil",
    "Category:Monuments_and_memorials_in_Mexico",
    "Category:Monuments_and_memorials_in_Poland",
    "Category:Monuments_and_memorials_in_Greece",
    "Category:Monuments_and_memorials_in_Turkey",
    "Category:World_Heritage_Sites_in_France",
    "Category:World_Heritage_Sites_in_Italy",
    "Category:World_Heritage_Sites_in_Spain",
    "Category:World_Heritage_Sites_in_Germany",
    "Category:World_Heritage_Sites_in_United_Kingdom",
    "Category:World_Heritage_Sites_in_China",
    "Category:World_Heritage_Sites_in_India",
    "Category:World_Heritage_Sites_in_Japan",
    "Category:World_Heritage_Sites_in_Mexico",
    "Category:World_Heritage_Sites_in_Brazil",
    "Category:World_Heritage_Sites_in_Peru",
    "Category:World_Heritage_Sites_in_Egypt",
    "Category:World_Heritage_Sites_in_Greece",
    "Category:World_Heritage_Sites_in_Turkey",
    "Category:World_Heritage_Sites_in_Iran",
    "Category:World_Heritage_Sites_in_Russia",
    "Category:World_Heritage_Sites_in_Portugal",
    "Category:World_Heritage_Sites_in_Poland",
    "Category:World_Heritage_Sites_in_Czech_Republic",
    "Category:World_Heritage_Sites_in_Austria",
    "Category:Images_from_Wiki_Loves_Monuments_in_France",
    "Category:Images_from_Wiki_Loves_Monuments_in_Italy",
    "Category:Images_from_Wiki_Loves_Monuments_in_Spain",
    "Category:Images_from_Wiki_Loves_Monuments_in_Germany",
    "Category:Images_from_Wiki_Loves_Monuments_in_United_Kingdom",
    "Category:Images_from_Wiki_Loves_Monuments_in_Poland",
    "Category:Images_from_Wiki_Loves_Monuments_in_Netherlands",
    "Category:Images_from_Wiki_Loves_Monuments_in_Belgium",
    "Category:Images_from_Wiki_Loves_Monuments_in_Austria",
    "Category:Images_from_Wiki_Loves_Monuments_in_Switzerland",
    "Category:Images_from_Wiki_Loves_Monuments_in_Portugal",
    "Category:Images_from_Wiki_Loves_Monuments_in_Greece",
    "Category:Images_from_Wiki_Loves_Monuments_in_Turkey",
    "Category:Images_from_Wiki_Loves_Monuments_in_Brazil",
    "Category:Images_from_Wiki_Loves_Monuments_in_Mexico",
    "Category:Images_from_Wiki_Loves_Monuments_in_India",
    "Category:Buildings_in_Paris",
    "Category:Buildings_in_Rome",
    "Category:Buildings_in_London",
    "Category:Buildings_in_Barcelona",
    "Category:Buildings_in_Madrid",
    "Category:Buildings_in_Berlin",
    "Category:Buildings_in_Vienna",
    "Category:Buildings_in_Prague",
    "Category:Buildings_in_Florence",
    "Category:Buildings_in_Venice",
    "Category:Buildings_in_Istanbul",
    "Category:Buildings_in_Athens",
    "Category:Buildings_in_Lisbon",
    "Category:Buildings_in_Amsterdam",
    "Category:Buildings_in_Brussels",
    "Category:Buildings_in_Budapest",
    "Category:Buildings_in_Warsaw",
    "Category:Buildings_in_Moscow",
    "Category:Buildings_in_Saint_Petersburg",
    "Category:Buildings_in_Cairo",
    "Category:Buildings_in_Jerusalem",
    "Category:Buildings_in_Tokyo",
    "Category:Buildings_in_Beijing",
    "Category:Buildings_in_Delhi",
    "Category:Buildings_in_Rio_de_Janeiro",
    "Category:Buildings_in_Mexico_City",
    "Category:Buildings_in_Buenos_Aires",
    "Category:Medieval_castles_in_France",
    "Category:Medieval_castles_in_Germany",
    "Category:Medieval_castles_in_England",
    "Category:Gothic_cathedrals_in_France",
    "Category:Gothic_cathedrals_in_Germany",
    "Category:Gothic_cathedrals_in_Spain",
    "Category:Renaissance_architecture_in_Italy",
    "Category:Renaissance_architecture_in_France",
    "Category:Baroque_architecture_in_Italy",
    "Category:Baroque_architecture_in_Austria",
    "Category:Baroque_architecture_in_Germany",
    "Category:Roman_architecture_in_Italy",
    "Category:Roman_architecture_in_France",
    "Category:Roman_architecture_in_Spain",
    "Category:Fortified_cities",
    "Category:Historic_city_centers",
    "Category:Ancient_cities",
    "Category:Archaeological_sites_in_Italy",
    "Category:Archaeological_sites_in_Greece",
    "Category:Archaeological_sites_in_Egypt",
    "Category:Archaeological_sites_in_Turkey",
    "Category:Archaeological_sites_in_Peru",
    "Category:Archaeological_sites_in_Mexico",
]

def fetch_category_images(category, limit=100):
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
        pages = fetch_category_images(category, limit=300)

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

        time.sleep(3)

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

