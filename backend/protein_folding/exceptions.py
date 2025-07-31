from fastapi import HTTPException
from typing import Any, Dict, Optional


class ProteinFoldingError(Exception):
    """Base exception for protein folding API errors."""

    def __init__(self, message: str, status_code: Optional[int] = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ProteinFoldingAPIError(ProteinFoldingError):
    """Exception raised when protein folding API returns an error."""

    def __init__(
        self,
        message: str,
        status_code: int,
        response_data: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message, status_code)
        self.response_data = response_data


class ProteinSequenceValidationError(ProteinFoldingError):
    """Exception raised when protein sequence validation fails."""

    def __init__(self, message: str):
        super().__init__(message, 400)


class ProteinFoldingTimeoutError(ProteinFoldingError):
    """Exception raised when protein folding API request times out."""

    def __init__(self, message: str = "Protein folding API request timed out"):
        super().__init__(message, 408)


class ProteinFoldingConnectionError(ProteinFoldingError):
    """Exception raised when connection to protein folding API fails."""

    def __init__(self, message: str = "Failed to connect to protein folding API"):
        super().__init__(message, 503)


def handle_protein_folding_exception(error: ProteinFoldingError) -> HTTPException:
    """Convert protein folding exceptions to FastAPI HTTPException."""
    status_code = error.status_code or 500
    return HTTPException(status_code=status_code, detail=error.message)
