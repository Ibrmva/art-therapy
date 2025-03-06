# System Architecture Scheme

```mermaid
sequenceDiagram
    participant User
    participant Frontend[Frontend (Vite/React)]
    participant Backend[Backend (Node.js/Express)]
    participant OpenAI[OpenAI DALL-E API]
    
    User->>Frontend: Interacts with UI
    Frontend->>Backend: Sends API request (POST)
    Backend->>OpenAI: Forwards request to DALL-E API
    OpenAI-->>Backend: Returns generated image
    Note right of OpenAI: Image returned as base64 string
    Note right of Backend: Processes image (resize, format, etc.)
    Backend-->>Frontend: Sends processed response
    Frontend-->>User: Displays result
```

## Connection Details:
1. **Frontend**:
   - Built with Vite + React
   - Makes API calls to backend using fetch()
   
2. **Backend**:
   - Node.js + Express server
   - Handles CORS for frontend access
   - Processes requests and communicates with OpenAI API
   
3. **API Communication**:
   - Frontend sends POST requests to backend endpoints
   - Backend forwards requests to OpenAI DALL-E API
   - Responses flow back through backend to frontend
