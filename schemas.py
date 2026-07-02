# embed-engine/schemas.py
from pydantic import BaseModel
from typing import List

class Publication(BaseModel):
    title: str

class SuggestRequest(BaseModel):
    skills: List[str]
    interests: List[str]
    publications: List[Publication]
