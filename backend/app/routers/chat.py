from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models,database
from app.ai import ai_huggingface
import chromadb
from app.security import get_current_user
from pydantic import BaseModel

class ChatMessageIn(BaseModel):
    message: str
    session_id: str

class ChatMessageOut(BaseModel):
    response: str

class ChatSessionIn(BaseModel):
    message: str

class ChatSessionOut(BaseModel):
    session_id: int

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

def prepare_context(search_results) -> str:
    data=search_results["metadatas"][0]
    context = ""
    for i in range(5):
        context += f"Law: {data[i]['law']}\n"
        if "article_number" in data[i]:
            context += f"Article Number: {data[i]['article_number']}\n"
            context += f"Part: {data[i]['part']}\n"
            context += f"Part Title: {data[i]['part_title']}\n"
        else:
            context += f"Section Number: {data[i]['section_number']}\n"
        context += f"Law Text: {data[i]['text']}\n"
    return context

def make_prompt(context, user_message) -> str:
    prompt = f""" You are a law assistant, who explains indian laws to the users strictly
                based on the context given to you, the user's message is this {user_message}, the context is the five most nearest laws
                to the users query in the database that are extracted by us, here are these 5 laws in a very structured way.
                {context}, explain strictly based on the context given to you and try to answer the user's query."""
    return prompt

@router.post("/message", response_model=ChatMessageOut)
def chat_message(chat_message_in: ChatMessageIn, db:Session = Depends(database.get_db), user_id: int = Depends(get_current_user)) -> ChatMessageOut:
    new_chat = models.ChatMessage(session_id=chat_message_in.session_id, message=chat_message_in.message, role="user", context=None)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    search_results = search_vector(chat_message_in.message)
    print(search_results)
    context = prepare_context(search_results)
    prompt = make_prompt(context, chat_message_in.message)
    response = ai_huggingface(prompt)

    new_chat = models.ChatMessage(session_id=chat_message_in.session_id, message=response, role="assistant", context=context)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return ChatMessageOut(response=response)

@router.post("/session", response_model=ChatSessionOut)
def chat_sessions(chat_session_in: ChatSessionIn, user_id: int = Depends(get_current_user), db:Session = Depends(database.get_db)) -> ChatSessionOut:
    prompt_for_title = f"Create a title for a new chat session with the first message {chat_session_in.message}, Give strictly only the title and do not take more than 255 characters at any cost. Keep it concise."
    title = ai_huggingface(prompt_for_title)
    new_session = models.ChatSession(user_id=user_id, title=title)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    session_id = new_session.id
    return ChatSessionOut(session_id=session_id)