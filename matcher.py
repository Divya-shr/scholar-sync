import os
from huggingface_hub import InferenceClient

# Pass the KEY NAME ("HF_TOKEN") to os.getenv, not the token value
HF_TOKEN = os.getenv("HF_TOKEN")
client = InferenceClient(api_key=HF_TOKEN)

def get_embedding(text: str):
    """Generates embeddings using HF API with zero local RAM usage."""
    return client.feature_extraction(
        text=text,
        model="sentence-transformers/all-MiniLM-L6-v2"
    )

def suggest_projects(texts: list[str]):
    embeddings = [get_embedding(t) for t in texts]
    
    # Perform vector similarity / matching logic here
    results = []  # Ensure 'results' is populated before returning
    return results