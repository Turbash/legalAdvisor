import re
import json

with open("constitution_articles_str.json", "r", encoding="utf-8") as f:
    articles = json.load(f)
    print(len(articles))
parts = [
    {"part": "PART I", "title": "PART I - The Union and its Territory", "start": "1", "end": "4"},
    {"part": "PART II", "title": "PART II - Citizenship", "start": "5", "end": "11"},
    {"part": "PART III", "title": "PART III - Fundamental Rights", "start": "12", "end": "35"},
    {"part": "PART IV", "title": "PART IV - Directive Principles of State Policy", "start": "36", "end": "51"},
    {"part": "PART IVA", "title": "PART IVA - Fundamental Duties", "start": "51A", "end": "51A"},
    {"part": "PART V", "title": "PART V - The Union", "start": "52", "end": "151"},
    {"part": "PART VI", "title": "PART VI - The States", "start": "152", "end": "237"},
    {"part": "PART VII", "title": "PART VII - The States in Part B of the First Schedule", "start": "238", "end": "238"},
    {"part": "PART VIII", "title": "PART VIII - The Union Territories", "start": "239", "end": "242"},
    {"part": "PART IX", "title": "PART IX - Panchayats", "start": "243", "end": "243-O"},
    {"part": "PART IXA", "title": "PART IXA - Municipalities", "start": "243P", "end": "243ZG"},
    {"part": "PART IXB", "title": "PART IXB - Cooperative Societies", "start": "243ZH", "end": "243ZT"},
    {"part": "PART X", "title": "PART X - The Scheduled and Tribal Areas", "start": "244", "end": "244A"},
    {"part": "PART XI", "title": "PART XI - Relations between the Union and the States", "start": "245", "end": "263"},
    {"part": "PART XII", "title": "PART XII - Finance, Property, Contracts and Suits", "start": "264", "end": "300A"},
    {"part": "PART XIII", "title": "PART XIII - Trade, Commerce and Intercourse within the Territory of India", "start": "301", "end": "307"},
    {"part": "PART XIV", "title": "PART XIV - Services under the Union and the States", "start": "308", "end": "323"},
    {"part": "PART XIVA", "title": "PART XIVA - Tribunals", "start": "323A", "end": "323B"},
    {"part": "PART XV", "title": "PART XV - Elections", "start": "324", "end": "329A"},
    {"part": "PART XVI", "title": "PART XVI - Special Provisions relating to certain classes", "start": "330", "end": "342A"},
    {"part": "PART XVII", "title": "PART XVII - Official Language", "start": "343", "end": "351"},
    {"part": "PART XVIII", "title": "PART XVIII - Emergency Provisions", "start": "352", "end": "360"},
    {"part": "PART XIX", "title": "PART XIX - Miscellaneous", "start": "361", "end": "367"},
    {"part": "PART XX", "title": "PART XX - Amendment of the Constitution", "start": "368", "end": "368"},
    {"part": "PART XXI", "title": "PART XXI - Temporary, Transitional and Special Provisions", "start": "369", "end": "392"},
    {"part": "PART XXII", "title": "PART XXII - Short title, Commencement, Authoritative Text in Hindi and Repeals", "start": "393", "end": "395"},
]


law_id = "constitution_1950"
law_title = "Constitution of India"
preamble_text = "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship;\nEQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation; IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION"

def split_article(art):
    match = re.match(r"(\d+)([A-Z\-]*)", art.replace(".", ""))
    if match:
        num = int(match.group(1))
        letters = match.group(2)
        return num, letters
    return 0, ""

def is_between(article, start, end):
    a_num, a_letters = split_article(article)
    s_num, s_letters = split_article(start)
    e_num, e_letters = split_article(end)

    if a_num < s_num or a_num > e_num:
        return False
    if a_num == s_num and a_letters < s_letters:
        return False
    if a_num == e_num and a_letters > e_letters:
        return False
    return True

final_articles = []

for article in articles:
    art_num = article["article"]
    art_text = article["description"]
    
    assigned_part = None
    part_title = None
    for p in parts:
        if is_between(art_num, p["start"], p["end"]):
            assigned_part = p["part"]
            part_title = p["title"]
            break
    
    final_articles.append({
        "law_id": law_id,
        "law_title": law_title,
        "preamble": preamble_text,
        "part": assigned_part,
        "part_title": part_title,
        "article_number": art_num,
        "text": art_text,
        "embedding_text": f"{law_title}\n{preamble_text}\n{art_text}"
    })

with open("constitution_articles_final.json", "w", encoding="utf-8") as f:
    json.dump(final_articles, f, ensure_ascii=False, indent=2)

print("Saved", len(final_articles), "articles with parts to constitution_articles_final.json")