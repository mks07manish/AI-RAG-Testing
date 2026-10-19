def retrieval_metrics(relevant_ids: list[str], retrieved_ids: list[str], k: int) -> dict:
    relevant = set(relevant_ids)
    top = retrieved_ids[:k]
    hits = sum(item in relevant for item in top)
    recall = hits / len(relevant) if relevant else (1.0 if not top else 0.0)
    precision = hits / k if k else 0.0
    mrr = next((1.0 / rank for rank, item in enumerate(top, 1) if item in relevant), 0.0)
    return {"recall_at_k": round(recall, 4),
            "precision_at_k": round(precision, 4), "mrr": round(mrr, 4)}
