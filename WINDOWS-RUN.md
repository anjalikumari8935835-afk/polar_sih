# Polar Science Portal — Windows

## One-click run

1. Make sure **Node.js/npm** and **Python 3.10+** are installed.
2. Open this folder.
3. Double-click **`run-windows.bat`**.
4. The launcher automatically:
   - finds free backend/frontend ports,
   - creates `ai_backend\.venv`,
   - installs Python dependencies,
   - installs frontend dependencies,
   - starts the AI backend,
   - waits for `/api/status`,
   - starts Next.js,
   - opens the website in your browser.

The default URLs are `http://localhost:3000` for the website and `http://127.0.0.1:8000` for the AI backend, but the launcher automatically moves to the next free port if either is busy.

## Gemini API key

Open:

`ai_backend\.env`

and optionally set:

`GEMINI_API_KEY=your_key_here`

The project still has a PDF-retrieval fallback when Gemini is not configured.

## Research PDFs

Put your `.pdf` research files inside:

`ai_backend\PDF\`

The backend indexes them when it starts. You can also use the reindex endpoint from the application if needed.

## Main features

- Polar research chatbot
- PDF/RAG retrieval
- concise research summary
- 10 key points
- source evidence and metadata
- research figure extraction
- data visualizations when usable numerical data is available
- Outreach AI Summary
- Social Media Post generation for X/Twitter, Facebook, Instagram, LinkedIn and Threads
- Interesting Captions with platform cards
- individual Copy buttons
- Outreach AI modal close button and Escape-to-close
- automatic port handling on Windows

## Stop the application

Close the two terminal windows opened by `run-windows.bat`.

## Troubleshooting

If Python dependencies fail:

```bat
ai_backend\.venv\Scripts\python.exe -m pip install -r ai_backend\requirements.txt
```

If frontend dependencies fail:

```bat
npm install
```

Then run `run-windows.bat` again.


### If you already ran an older package

Use this updated package. The Windows launcher has been fixed so the backend/frontend helper batch files are launched through `cmd /k call`; the previous package could show `start-backend-windows.bat "8000" is not recognized`.
