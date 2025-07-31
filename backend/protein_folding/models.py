from typing import List
from pydantic import BaseModel, Field


class ProteinSequenceRequest(BaseModel):
    """Request model for protein folding."""

    sequence: str = Field(
        ...,
        description="Protein sequence using single-letter amino acid codes",
        min_length=1,
        max_length=10000,  # Reasonable limit for ESMFold
    )


class FoldResult(BaseModel):
    """Model for ESMFold API response data."""

    pdb: str = Field(..., description="List of PDB structures")
    plddt: List[float] = Field(
        ..., description="Predicted Local Distance Difference Test (pLDDT) scores"
    )


class ProteinFoldingResponse(BaseModel):
    """Response model for protein folding."""

    results: List[FoldResult] = Field(..., description="Folding Results")
