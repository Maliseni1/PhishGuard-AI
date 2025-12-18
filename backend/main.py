# backend/main.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Configuration
API_KEY = os.getenv("AI_API_KEY")
MODEL_NAME = os.getenv("AI_MODEL", "qwen2.5:1.5b")

# LOGIC: Initialize the OpenAI Client
# If no real API Key is found, we assume Local Ollama.
# We MUST provide a dummy api_key (like "ollama") to prevent the library from crashing.
if not API_KEY:
    print(f"⚠️  No API Key found. Switching to Local Ollama ({MODEL_NAME})...")
    client = OpenAI(
        base_url="http://localhost:11434/v1",
        api_key="ollama"  # <--- CRITICAL FIX: Dummy key required for local models
    )
else:
    print(f"🚀 Using Cloud API (Groq/OpenAI) with model: {MODEL_NAME}")
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=API_KEY
    )

# Data Models
class ChatRequest(BaseModel):
    message: str
    scenario: str

# System Prompts (The "Brain")
SYSTEM_PROMPTS = {
    "bank": "You are a simulator for security training. You are pretending to be a Bank Fraud Alert agent. Your goal is to politely but urgently convince the user to verify their PIN number or account password. Do not actually accept credentials, if they provide them, break character and tell them they failed the test.",
    "hr": "You are pretending to be the Head of HR. You are writing about a mandatory holiday bonus confirmation. You need the user to click a 'link' (simulate this) or reply with their employee ID.",
}

# 1. Start Endpoint (Triggers the first message from the scammer)
@app.get("/start/{scenario}")
async def start_scenario(scenario: str):
    # Hardcoded opening lines to ensure the simulation starts instantly
    opening_lines = {
        "bank": "This is the Fraud Prevention Department. We have detected unauthorized activity on your account ending in 1234. Reply immediately to verify your identity.",
        "hr": "Urgent: This is Human Resources. Your 2024 tax documents are pending signature. Please confirm your Employee ID to receive the secure link.",
        "support": "Hello, this is IT Support. We noticed your computer has a virus. Please install our remote tool so we can fix it."
    }
    
    return {"reply": opening_lines.get(scenario, "Hello, how can I help you?")}

# 2. Chat Endpoint (Handles the conversation)
@app.post("/chat")
async def chat(request: ChatRequest):
    system_instruction = SYSTEM_PROMPTS.get(request.scenario, "You are a helpful assistant.")
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": request.message}
            ]
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print(f"Error: {e}")
        # If Ollama is not running, this catches the error
        raise HTTPException(status_code=500, detail="AI Service unavailable. Is Ollama running?")

@app.get("/")
def read_root():
    return {"status": "PhishGuard Backend Running", "mode": "Local" if not API_KEY else "Cloud"}