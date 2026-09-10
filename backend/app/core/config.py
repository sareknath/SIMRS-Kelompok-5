import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "mysql+pymysql://simrs_user:simrs_pass@mysql:3306/simrs_db"
    )
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-this-secret-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8  # 8 jam, 1 shift kerja


settings = Settings()
