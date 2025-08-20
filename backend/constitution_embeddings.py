from sentence_transformers import SentenceTransformer
import chromadb
import json

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_collection(name="legal_docs")

all_docs, all_ids, all_metadatas = [], [], []

with open("constitution_articles_final.json", "r") as f:
    data = json.load(f)
    for item in data:
        unique_id=f"{item['law_id']}_{item['article_number']}"
        all_docs.append(item["text"])
        all_ids.append(unique_id)
        all_metadatas.append({"law": item["law_title"],"preamble": item["preamble"], "article_number": item["article_number"],"part": item["part"],"part_title": item["part_title"], "text": item["text"]})

embeddings = model.encode(all_docs).tolist()

collection.add(
    documents=all_docs,
    embeddings=embeddings,
    ids=all_ids,
    metadatas=all_metadatas
)

print(f"✅ Stored {len(all_docs)} law sections into Chroma from bns_sections.json!")

query = "right to life"
query_emb = model.encode([query]).tolist()

results = collection.query(
    query_embeddings=query_emb,
    n_results=4
)

print(results)