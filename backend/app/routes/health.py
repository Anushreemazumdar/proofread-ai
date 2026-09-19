from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["Health & Status"])


@router.get("/")
def root():
    return {
        "message": "ProofRead API is running",
        "version": settings.VERSION,
        "tagline": settings.DESCRIPTION
    }


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "bedrock_configured": settings.has_aws_credentials,
        "region": settings.AWS_REGION,
        "model_id": settings.BEDROCK_MODEL_ID
    }
