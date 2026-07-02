from fastapi import FastAPI
from schemas import SuggestRequest
from matcher import suggest_projects

app = FastAPI()

@app.post("/suggest")
async def suggest(req: SuggestRequest):
    texts = req.skills + req.interests + [p.title for p in req.publications]
    results = suggest_projects(texts)
    return { "projects": results }
