import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()


class Settings:
    PROJECT_NAME: str = "ProofRead API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Turn confusing notices into clear decisions."

    # AWS & Bedrock Configuration
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    # Configurable Bedrock Model ID - default Claude 3 Haiku or Sonnet
    BEDROCK_MODEL_ID: str = os.getenv(
        "BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0"
    )
    AWS_ACCESS_KEY_ID: str | None = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str | None = os.getenv("AWS_SECRET_ACCESS_KEY")

    # Optional S3 & DynamoDB configurations for future cloud deployment
    S3_BUCKET_NAME: str | None = os.getenv("S3_BUCKET_NAME")
    DYNAMODB_TABLE_NAME: str | None = os.getenv("DYNAMODB_TABLE_NAME")

    # CORS Settings
    @property
    def cors_origins(self) -> List[str]:
        raw_origins = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
        )
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    @property
    def has_aws_credentials(self) -> bool:
        """
        Check if AWS credentials or default profile/region are available.
        """
        if self.AWS_ACCESS_KEY_ID and self.AWS_SECRET_ACCESS_KEY:
            return True
        # Check standard AWS environment variables if set globally
        if os.getenv("AWS_PROFILE") or os.getenv("AWS_SESSION_TOKEN"):
            return True
        # If running on AWS EC2/ECS/Lambda with IAM instance profile
        if os.getenv("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") or os.getenv(
            "AWS_EXECUTION_ENV"
        ):
            return True
        return False


settings = Settings()
