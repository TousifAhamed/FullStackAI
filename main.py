from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import requests
import base64
from dotenv import load_dotenv
import time
from uuid import uuid4

from PIL import Image
import io

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory
app.mount("/static", StaticFiles(directory="static"), name="static")


# Create a model for the prompt request
class ImagePrompt(BaseModel):
    prompt: str

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY") 

# Serve index.html at root
@app.get("/")
async def read_root():
    return FileResponse("index.html")


@app.get("/animal/{animal_type}")
async def get_animal(animal_type: str):
    if animal_type in ["cat", "dog", "elephant"]:
        return {"image_path": f"/static/{animal_type}.jpg"}
    return {"error": "Animal not found"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    return {
        "filename": file.filename,
        "size": len(content),
        "content_type": file.content_type,
    }

@app.post("/generate-image")
async def generate_image(prompt_data: ImagePrompt):
    prompt = prompt_data.prompt
    print("Received prompt:", prompt)

    url = "https://api.stability.ai/v2beta/stable-image/generate/ultra"
    
    headers = {
        "authorization": f"Bearer {STABILITY_API_KEY}",
        "accept": "image/*"
    }
    
    payload = {
        "prompt": prompt,
        "output_format": "webp",
    }
    
    files = {"none": ('', '')}
    
    try:
        response = requests.post(url, headers=headers, files=files, data=payload)
        print("StabilityAI Response Status:", response.status_code)
        
        if response.status_code == 200:
            # Generate a unique filename using UUID
            unique_filename = f"generated_image_{uuid4().hex}.webp"
            image_path = os.path.join("static", unique_filename)
            with open(image_path, 'wb') as file:
                file.write(response.content)
            print("Image saved to:", image_path)
            return {"image_path": f"/static/{unique_filename}"}
        else:
            # Handle both JSON and non-JSON error responses
            try:
                error_detail = response.json()
            except ValueError:
                error_detail = response.text
            print("Error Response:", error_detail)
            return {
                "error": f"Image creation failed with status {response.status_code}",
                "details": error_detail,
            }
    except Exception as e:
        print("Exception occurred:", str(e))
        return {
            "error": "An unexpected error occurred.",
            "details": str(e),
        }