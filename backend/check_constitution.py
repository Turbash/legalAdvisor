import json

with open("constitution_articles_final.json", "r") as f:
    data = json.load(f)
    for item in data:
        if not item["part"]:
            item["part"] = "PART IX"
            item["part_title"] = "PART IX - Panchayats"

    with open("constitution_articles_final.json", "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)