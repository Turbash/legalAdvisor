from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
MODEL_ID = os.getenv("MODEL_ID")

client = InferenceClient(model=MODEL_ID, token=HF_API_TOKEN)

def ai_huggingface(prompt):
    messages = [{"role": "user", "content": prompt}]
    response = client.chat.completions.create(messages)
    return response.choices[0].message.content

if __name__ == "__main__":
    prompt = "Hello, how can I assist you today?"
    response = ai_huggingface(prompt)
    print(response)