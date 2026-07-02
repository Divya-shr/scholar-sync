from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-mpnet-base-v2")

def get_embedding(texts: list[str]):
    return model.encode(texts, convert_to_tensor=True, normalize_embeddings=True)
