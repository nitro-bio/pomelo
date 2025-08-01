from typing import List, Optional
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


class Boltz2Request(BaseModel):
    """Request model for Boltz-2."""

    sequence: str = Field(
        ...,
        description="Protein sequence using single-letter amino acid codes",
        min_length=1,
        max_length=10000,
    )

    ligand_smiles: Optional[str] = Field(
        None, description="SMILES notation for small molecule ligand"
    )

    recycling_steps: int = Field(
        1, description="Number of recycling steps for structure refinement", ge=1, le=10
    )

    sampling_steps: int = Field(
        50, description="Number of sampling steps for diffusion", ge=1, le=100
    )

    diffusion_samples: int = Field(
        3, description="Number of diffusion samples to generate", ge=1, le=10
    )


class Boltz2Result(BaseModel):
    """Model for Boltz-2 API response data."""

    mmcif_string: str = Field(..., description="mmCIF structure string")

    plddt: List[float] = Field(
        ..., description="Predicted Local Distance Difference Test (pLDDT) scores"
    )

    confidence_scores: List[float] = Field(
        ..., description="Overall confidence scores for each structure"
    )


class Boltz2Response(BaseModel):
    """Response model for Boltz-2."""

    results: List[Boltz2Result] = Field(..., description="Boltz-2 Results")
