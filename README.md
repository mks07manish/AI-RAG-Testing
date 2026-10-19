# AI-RAG-TestBench

Local-first RAG evaluation starter: FastAPI + ChromaDB + Ollama + Playwright.

## Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama installed and running

## Setup
1. Pull models:
   `ollama pull llama3.2:3b`
   `ollama pull embeddinggemma`
2. Create Python environment and install dependencies:
   - Windows: `python -m venv .venv` then `.venv\\Scripts\\activate`
   - macOS/Linux: `python3 -m venv .venv` then `source .venv/bin/activate`
   - `pip install -r requirements.txt`
3. Ingest sample documents: `python -m app.ingest`
4. Start API: `uvicorn app.main:app --reload --port 8000`
5. In a second terminal: `npm install` then `npx playwright test`

API docs: http://127.0.0.1:8000/docs

## What is evaluated?
- Recall@K, Precision@K, MRR: deterministic retrieval metrics when relevant chunk IDs are supplied.
- Faithfulness and answer relevance: Ollama-as-judge scores between 0 and 1.
- Playwright validates the API response and abstention behavior.

The sample employee policy is fictional. The LLM judge can be wrong; calibrate thresholds and inspect failures before treating scores as release gates. For robust retrieval metrics, populate `relevant_chunk_ids` after the first ingestion using the IDs returned by the API.
