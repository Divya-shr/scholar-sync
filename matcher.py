from model import get_embedding
from project_data import PROJECT_DATABASE
from sklearn.metrics.pairwise import cosine_similarity

def suggest_projects(texts: list[str]):
    input_embedding = get_embedding(" ".join(texts))
    scores = []

    for project in PROJECT_DATABASE:
        project_embedding = get_embedding(project["title"] + " " + project["description"])
        score = cosine_similarity([input_embedding], [project_embedding])[0][0]
        scores.append((score, project))

    top_projects = sorted(scores, reverse=True, key=lambda x: x[0])[:5]
    return [
        {
            "title": p["title"],
            "description": p["description"],
            "tags": p.get("tags", []),
            "score": float(round(score * 100, 2))  
        }
        for score, p in top_projects
    ]
