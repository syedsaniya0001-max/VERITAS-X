# VERITAS-X — Verification & Evidence Reasoning Intelligence Trust Assurance System — X

**HackFusion 2026 · Theme 8 — Multi-Agent AI Reasoning & Verification Engine**

**Team TechNova · VEMU Institute of Technology**
- G. SONIYA — III-II B.Tech, CSE-AI
- S. SANIYA — III-II B.Tech, CSE-AI
- T. MEGHANA — III-II B.Tech, CSE-AI

VERITAS-X separates evidence retrieval from answer acceptance. The browser UI is served by a small Python backend that retrieves live Wikipedia sources, runs deterministic arithmetic and safety checks, extracts candidate claims, checks each claim against each source passage, detects conflicts, and routes outcomes through a central decision gate.

## Run locally

Python 3.10 or newer is required. There are no third-party Python dependencies.

```powershell
cd veritas-x-runnable
python server.py
```

Open:

```text
http://localhost:8080
```

The verification endpoint uses Wikipedia's public API in the selected interface language. Arithmetic is independently evaluated with Python `Decimal`; prompt-injection patterns are blocked before retrieval. Without a model, the system returns retrieved source text, checks asserted claims, and abstains when sources are unavailable. Session metrics reset when the server restarts.

## Agent architecture

- **Planner:** prepares a concise source query; with a model configured, this is a separate prompted call.
- **Researcher:** retrieves Wikipedia articles and returns linked evidence snippets.
- **Reasoner:** summarizes retrieved evidence without a model, or drafts a cited answer with a configured model.
- **Claim Extractor:** splits the candidate answer into reviewable statements.
- **Coder / Tool-Use Agent:** validates allowlisted calculator/Wikipedia tool names, required fields, parameter types, bounded expressions, model endpoint requests, source hosts, response schemas, and structured tool errors before execution/acceptance.
- **Independent Verifier:** checks each claim against each source passage separately using content anchors, predicate alignment, numeric agreement, polarity, and evidence excerpts. The method is explicitly deterministic/heuristic, not full semantic entailment.
- **Contradiction Engine:** reports claim/evidence, source/source, and claim/claim conflicts with excerpts.
- **Adversarial Critic:** makes a separate prompted review call when a model is configured; a proposed revision is re-extracted and rechecked before a corrected decision.
- **Execution Verifier:** uses a restricted Decimal calculator. It does not execute arbitrary Python or user code.
- **Safety Gate and Decision Gate:** block recognized unsafe patterns and return `ACCEPT`, `CORRECT`, `REQUEST_MORE_EVIDENCE`, `REJECT`, or `ABSTAIN` with reason, confidence, failed checks, evidence, and affected claims.
- **Proof and audit views:** after a run, show the live claim → evidence → verification → decision path and revision events.

When enabled, Planner, Reasoner, and Critic use separate prompts but the same configured model endpoint. They are not independent models. The deterministic verifier is the separate acceptance check.

## Optional model

Planner, Reasoner, and Critic can each call an OpenAI-compatible chat-completions endpoint. Configure it on the server, never in browser code. For a local Ollama server in PowerShell:

```powershell
$env:VERITAS_MODEL="qwen2.5:7b"
$env:VERITAS_MODEL_URL="http://localhost:11434/v1/chat/completions"
python server.py
```

For a hosted provider, set `VERITAS_MODEL_URL`, `VERITAS_MODEL`, and `VERITAS_API_KEY` in the server environment. Do not commit `.env` files or API keys. Set `PORT` for the listening port and `HOST=0.0.0.0` when running behind a deployment platform.

## Verification scope and limits

- Retrieval currently uses Wikipedia only; citations link to the retrieved articles.
- Claim verification uses a deterministic claim→evidence path with content-anchor, predicate, numeric, and polarity checks. It is still heuristic and not a semantic-entailment proof.
- The optional model generates answers from retrieved evidence, but the independent verifier remains a separate deterministic lexical check.
- The safety gate checks known English, Telugu, Hindi, Tamil, Kannada, and Malayalam instruction-override patterns; this is not exhaustive multilingual safety coverage.
- The restricted calculator is not an operating-system sandbox; arbitrary code is not executed.
- The Attack Lab's 15 named synthetic cases run through the backend pipeline, including tool/schema validation cases. Evaluation rates and latency are calculated from this fixture corpus only and do not represent real-world accuracy. Generation quality is explicitly marked `NOT MEASURED`.
- Session metrics are in-memory counters; they reset on restart and are not a durable audit database.

## API

- `POST /api/verify`: run the end-to-end verification flow.
- `POST /api/tools/execute`: validate and execute an allowlisted calculator or Wikipedia request.
- `GET /api/attack/cases`: list the current attack fixtures.
- `POST /api/attack/run`: run one attack fixture through the backend.
- `POST /api/evaluation/run`: run the fixture set and calculate verification metrics.
- `GET /api/health`: provider state and current-session counters.

## HackFusion submission

- Deployment URL: pending deployment
- Public GitHub repository: pending publication
- Team/member details are listed above.
- The server supports `HOST` and `PORT` environment variables for deployment. No deployment is performed by this project package.

## Tests

```powershell
python -m unittest discover -s . -p test_server.py -v
```

See [THEME8_COMPLIANCE.md](THEME8_COMPLIANCE.md) for requirement-by-requirement status.
