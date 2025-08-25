from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models,database
from app.ai import ai_huggingface
import chromadb

router = APIRouter(prefix="/chat", tags=["chat"])

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_collection("legal_docs")

def search_vector(query) -> list:
    results = collection.query(
    query_texts=[query],
    n_results=5,
    include=["documents", "metadatas", "distances"]
    )
    return results

def make_prompt(results) -> str:
    prompt = f""" You are a law assistant, who explains indian laws to the users strictly
                based on the context given to you, here is the context, {results}"""
    return prompt

@router.post("/message")
def chat_message(message: str, session_id: str, db:Session = Depends(database.get_db)):
    
    prompt = make_prompt(search_results)
    response = ai_huggingface(prompt)
    
    return {"response": response}

@router.post("/session")
def chat_sessions(user_id: str, message: str, db:Session = Depends(database.get_db)):
    prompt_for_title = f"Create a title for a new chat session with the first message {message}, Give strictly only the title and do not take more than 255 characters at any cost. Keep it concise."
    title = ai_huggingface(prompt_for_title)
    new_session = models.ChatSession(user_id=user_id, title=title)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    session_id = new_session.id
    return {"session_id": session_id}