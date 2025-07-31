import logging
from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvVars(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "/etc/secrets/.env"),
        env_file_encoding="utf-8",
    )
    DEBUG: bool = False
    NVIDIA_API_KEY: str


def check_env_vars() -> EnvVars:
    try:
        # Pydantic automatically validates and loads the environment variables
        return EnvVars()  # type: ignore
    except ValidationError as e:
        logging.debug(e.json())
        raise
