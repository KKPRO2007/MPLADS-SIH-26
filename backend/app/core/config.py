from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MPLADS API"
    environment: str = "development"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite:///./mplads.db"
    cors_origins: str = "http://localhost:3000"
    groq_api_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
