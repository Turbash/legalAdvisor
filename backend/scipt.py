import json

input_json = "constitution_of_india.json"
output_json = "constitution_articles_str.json"

with open(input_json, "r", encoding="utf-8") as f:
    articles = json.load(f)

for article in articles:
    article["article"] = str(article["article"])

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)

print(f"Updated JSON saved to {output_json}")
