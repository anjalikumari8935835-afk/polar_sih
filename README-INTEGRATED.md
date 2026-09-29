# Polar Science Portal — Website + Original AI Chatbot

This package uses the uploaded `polar-science-portal-main` website as the frontend/UI source. The AI chatbot implementation and Flask/PDF retrieval backend are carried over without changing the chatbot's answer-generation/retrieval behavior.

## Run on macOS

```bash
chmod +x run-integrated-mac.sh
./run-integrated-mac.sh
```

The launcher automatically finds free ports, so a service already using 3000 or 8000 will not block startup.

## Gemini

Set `GEMINI_API_KEY` in `ai_backend/.env` if you want Gemini generation. The backend remains grounded in the local PDF collection and has a retrieval fallback when Gemini is unavailable.

## Architecture

- Website: Next.js frontend from `polar-science-portal-main`
- Chatbot UI: `src/components/AIResearchAssistant.tsx`
- AI backend: `ai_backend/app.py`
- PDF corpus: `ai_backend/PDF/`
- Frontend API bridge: Next.js rewrite `/api/ai/*` -> Flask `/api/*`


## Outreach AI cards

The **AI Summary**, **Social Media Post**, and **Interesting Captions** cards on the Outreach page now use the same `/api/ai` research backend as the Polar AI assistant instead of local placeholder/setTimeout text. This keeps the content grounded in the indexed research collection and uses the same Gemini/fallback behavior.

If the backend reports that no relevant PDF evidence exists, add/reindex the research PDFs before generating outreach content.

## Port-conflict fix

`run-integrated-mac.sh` selects a free web port and AI backend port and explicitly passes the selected AI port to Flask. It also stops with the backend log if the AI service fails to start, instead of silently launching a website whose AI requests cannot connect.


## Mac startup note

If your terminal prompt already ends with `polar-science-portal-website-chatbot-fixed %`, you are already inside the project directory. Do **not** run `cd polar-science-portal-website-chatbot-fixed` again. Run:

```bash
chmod +x run-integrated-mac.sh
./run-integrated-mac.sh
```

The launcher keeps the automatically selected AI backend port in sync with Flask and Next.js. It also rebuilds the Python virtual environment if required imports are missing.


## Windows
For Windows, double-click `run-windows.bat`. See `WINDOWS-RUN.md`.
