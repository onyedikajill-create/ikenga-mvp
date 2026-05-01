# UJU Cycle Marvel v6.0

World-class research engine that compresses 6 months of feasibility study into 2 minutes.

## Quick Start

### Option A: Next.js (Recommended for ikenga.tech)
```powershell
cd C:\ikenga-mvp
npm install
npm run dev
# Open http://localhost:3000
```

### Option B: Python Standalone
```powershell
python uju.py "Why do organizations fail to learn?"
```

### Option C: Flask Web Server
```powershell
pip install flask flask-cors requests
python web_uju.py
# Open http://localhost:5000
```

## Deployment to ikenga.tech

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy to production
cd C:\ikenga-mvp
vercel --prod

# Set Ollama API URL (if using cloud Ollama)
vercel env add OLLAMA_API_URL
```

## API Endpoint

POST `/api/analyze`
```json
{ "query": "Why do organizations fail to learn?" }
```

Returns 6-agent analysis with executive summary, lens insights, and recommendations.

## Files Created

- `app/api/analyze/route.ts` - Next.js API route
- `app/dashboard/page.tsx` - UJU Cycle dashboard
- `app/page.tsx` - Updated homepage
- `uju.py` - Python standalone version
- `web_uju.py` - Flask web server
- `vercel.json` - Deployment config

## Note

Logos (UJU CYCLE LOGO 1.png, UJU CYCLE LOGO 2.png, UJU CYCLE LOGO PDF.pdf) could not be read - add them manually to `public/` folder and reference in page.tsx.
