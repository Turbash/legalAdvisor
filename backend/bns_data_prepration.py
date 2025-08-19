from PyPDF2 import PdfReader
import re

pdf_path = "../data/bns.pdf"

reader = PdfReader(pdf_path)

text=""

for page in reader.pages:
    t = page.extract_text()
    if t:
        text += t + "\n"

sections = re.split(r'(?m)^\d+\.(?=\D)', text)

cleaned_sections = [sec.strip() for sec in sections if sec.strip()]

for i, section in enumerate(cleaned_sections):
    print(f"\n--Section {i} --\n")
    print(section)