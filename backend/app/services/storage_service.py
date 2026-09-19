import os
import uuid
import tempfile
from pathlib import Path
from typing import Optional
from app.config import settings


class StorageService:
    """
    Storage abstraction: handles local file caching for document processing
    and provides hooks for future Amazon S3 upload without altering routes.
    """
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "proofread_uploads"
        self.temp_dir.mkdir(parents=True, exist_ok=True)
        self.s3_client = None

        if settings.S3_BUCKET_NAME and settings.has_aws_credentials:
            try:
                import boto3
                self.s3_client = boto3.client("s3", region_name=settings.AWS_REGION)
            except Exception as e:
                print(f"[StorageService] Notice: S3 client initialization deferred: {e}")

    def save_temp_file(self, file_bytes: bytes, original_filename: str) -> str:
        file_id = str(uuid.uuid4())
        ext = Path(original_filename).suffix or ".pdf"
        target_path = self.temp_dir / f"{file_id}{ext}"
        with open(target_path, "wb") as f:
            f.write(file_bytes)
        return str(target_path)

    def upload_to_s3(self, file_bytes: bytes, object_key: str) -> Optional[str]:
        if not self.s3_client or not settings.S3_BUCKET_NAME:
            return None
        try:
            self.s3_client.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=object_key,
                Body=file_bytes,
                ContentType="application/pdf"
            )
            return f"s3://{settings.S3_BUCKET_NAME}/{object_key}"
        except Exception as e:
            print(f"[StorageService] Warning: Failed to upload to S3: {e}")
            return None


storage_service = StorageService()
