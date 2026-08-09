from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import SuggestRequest
from matcher import suggest_projects

app = FastAPI()

# Enable CORS for your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your Netlify/Vercel frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/suggest")
async def suggest(req: SuggestRequest):
    texts = req.skills + req.interests + [p.title for p in req.publications]
    results = suggest_projects(texts)
    return { "projects": results }