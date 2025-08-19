from PyPDF2 import PdfReader
import re
import json

pdf_path = "../data/consumer_protection_act.pdf"
output_json = "consumer_protection_sections.json"

reader = PdfReader(pdf_path)

text=""

for page in reader.pages[3:]:
    t = page.extract_text()
    if t:
        text += t + "\n"

sections = re.split(r'(?m)^(\d+)\.(?:\(\d+\))?(?:\s(?=W))?', text)
print(sections[:3])
cleaned_sections = []
preamble="An Act to provide for protection of the interests of consumers and for the said purpose, to establish authorities for timely and effective administration and settlement of consumers' disputes and for matters connected therewith or incidental thereto."

for i in range(1, len(sections), 2):
    section_number = int(sections[i])
    section_text = sections[i+1].strip()
    section_text = re.sub(r'\s+', ' ', section_text)

    cleaned_sections.append({
        "law_id": "consumer_protection_2019",
        "law_title": "Consumer Protection Act",
        "preamble": preamble,
        "section_number": section_number,
        "text": section_text,
        "embedding_text": "Consumer Protection Act\n" + preamble + "\n" + section_text
    })

print("Total sections found:", len(cleaned_sections))

with open(output_json, 'w', encoding="UTF-8") as f:
    json.dump(cleaned_sections, f, ensure_ascii=False, indent=2)

print("Data saved to", output_json)