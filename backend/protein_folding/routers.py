import logging
from fastapi import APIRouter, HTTPException

from protein_folding.models import (
    ProteinFoldingResponse,
    ProteinSequenceRequest,
)
from protein_folding.esmfold.service import fold_protein
from protein_folding.exceptions import (
    ProteinFoldingError,
    handle_protein_folding_exception,
)


router = APIRouter()


@router.post("/protein_fold/esmfold", response_model=ProteinFoldingResponse)
async def fold_protein_esmfold(
    request: ProteinSequenceRequest,
) -> ProteinFoldingResponse:
    """
    Fold a protein sequence using NVIDIA ESMFold.

    Args:
        request: Request containing protein sequence

    Returns:
        ProteinFoldingResponse with folding results

    Raises:
        HTTPException: For various error conditions
    """
    try:
        fold_result = fold_protein(request.sequence)
        return ProteinFoldingResponse(results=[fold_result])
    except ProteinFoldingError as e:
        logging.error(f"Protein folding error: {e.message}")
        raise handle_protein_folding_exception(e)
    except Exception as e:
        logging.error(f"Unexpected error in protein folding: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during protein folding",
        )
