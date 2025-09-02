import chromadb

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_collection("legal_docs")

results = collection.get(ids=["constitution_1950_335", "constitution_1950_1"])
for law in results["documents"]:
    print(law)
print(results)