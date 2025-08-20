import chromadb

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_collection("legal_docs")

query = "what are fundamental rights"
results = collection.query(
    query_texts=[query],
    n_results=5,
    include=["documents", "metadatas", "distances"]
)
print(results)