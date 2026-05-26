import os
import json
import time
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
ACTOR_ID = "clockworks~tiktok-scraper"

HASHTAGS = [
    "myphamhanquoc",
    "kbeauty",
    "duongda",
    "skincare",
    "myphamhan",
]


def run_actor(hashtags: list[str]) -> str:
    url = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs"
    payload = {
        "hashtags": hashtags,
        "resultsPerPage": 50,
        "shouldDownloadVideos": False,
        "shouldDownloadCovers": False,
    }
    resp = requests.post(url, params={"token": APIFY_TOKEN}, json=payload)
    if not resp.ok:
        print("Error response:", resp.text)
        resp.raise_for_status()
    run_id = resp.json()["data"]["id"]
    print(f"Run started: {run_id}")
    return run_id


def wait_for_run(run_id: str) -> str:
    url = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs/{run_id}"
    while True:
        resp = requests.get(url, params={"token": APIFY_TOKEN})
        resp.raise_for_status()
        data = resp.json()["data"]
        status = data["status"]
        print(f"Status: {status}")
        if status == "SUCCEEDED":
            return data["defaultDatasetId"]
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            raise RuntimeError(f"Run {status}")
        time.sleep(10)


def fetch_results(dataset_id: str) -> list[dict]:
    url = f"https://api.apify.com/v2/datasets/{dataset_id}/items"
    resp = requests.get(url, params={"token": APIFY_TOKEN, "format": "json"})
    resp.raise_for_status()
    return resp.json()


def save(data: list[dict]) -> str:
    os.makedirs("data", exist_ok=True)
    date = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = f"data/tiktok_{date}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


if __name__ == "__main__":
    run_id = run_actor(HASHTAGS)
    dataset_id = wait_for_run(run_id)
    results = fetch_results(dataset_id)
    path = save(results)
    print(f"Saved {len(results)} items → {path}")
