from PyPDF2 import PdfReader
import re
import csv
import json

pdf_path = "../data/bns.pdf"
output_json = "bns_sections.json"
output_csv = "bns_sections.csv"

reader = PdfReader(pdf_path)

text=""

for page in reader.pages:
    t = page.extract_text()
    if t:
        text += t + "\n"

sections = re.split(r'(?m)^(\d+)\.(?:\(\d+\))?(?:\s(?=W))?', text)
print(sections[:3])
cleaned_sections = []

for i in range(1, len(sections), 2):
    section_number = int(sections[i])
    section_text = sections[i+1].strip()
    section_text = re.sub(r'\s+', ' ', section_text)

    cleaned_sections.append({
        "section_number": section_number,
        "text": section_text
    })

print("Total sections found:", len(cleaned_sections))

with open(output_csv, 'w', encoding = "UTF-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["section_number", "text"])
    writer.writeheader()
    for row in cleaned_sections:
        writer.writerow(row)

with open(output_json, 'w', encoding="UTF-8") as f:
    json.dump(cleaned_sections, f, ensure_ascii=False, indent=2)

print("Data saved to", output_json, "and", output_csv)