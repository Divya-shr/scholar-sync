import os
from huggingface_hub import InferenceClient

# Read token from Render Environment Variables
HF_TOKEN = os.getenv("HF_TOKEN")
client = InferenceClient(api_key=HF_TOKEN)

def get_embedding(text: str):
    """Generates embeddings using HF API with zero local RAM usage."""
    return client.feature_extraction(
        text=text,
        model="sentence-transformers/all-MiniLM-L6-v2"
    )

def suggest_projects(texts: list[str]):
    # Generate embeddings via HF API instead of local SentenceTransformer
    embeddings = [get_embedding(t) for t in texts]
    
    # Run your vector comparison / matching logic here
    # ...
    return results