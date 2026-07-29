from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import chat, extractor, rag

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AURA AI Production-grade FastAPI Backend wrapping LangChain core modules.",
)

# Configure CORS middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register active modular routers
app.include_router(chat.router)
app.include_router(extractor.router)
app.include_router(rag.router)


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint for API monitoring.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
