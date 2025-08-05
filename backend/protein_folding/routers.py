import logging
from fastapi import APIRouter, HTTPException

from protein_folding.models import (
    EsmfoldResponse,
    EsmfoldRequest,
    Boltz2Response,
    Boltz2Request,
)
from protein_folding.esmfold.service import fold_with_esmfold
from protein_folding.boltz2.service import fold_boltz2
from protein_folding.exceptions import (
    ProteinFoldingError,
    handle_protein_folding_exception,
)


router = APIRouter()


@router.post("/protein_fold/esmfold", response_model=EsmfoldResponse)
async def fold_protein_esmfold(
    request: EsmfoldRequest,
) -> EsmfoldResponse:
    """
    Fold a protein sequence using NVIDIA ESMFold.

    Args:
        request: Request containing protein sequence

    Returns:
        EsmfoldResponse with folding results

    Raises:
        HTTPException: For various error conditions
    """
    try:
        fold_result = await fold_with_esmfold(request.sequence)
        return EsmfoldResponse(results=[fold_result])
    except ProteinFoldingError as e:
        logging.error(f"Protein folding error: {e.message}")
        raise handle_protein_folding_exception(e)
    except Exception as e:
        logging.error(f"Unexpected error in protein folding: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during protein folding",
        )


@router.post("/protein_fold/boltz2", response_model=Boltz2Response)
async def fold_protein_boltz2(
    request: Boltz2Request,
) -> Boltz2Response:
    """
    Process protein structure prediction using Boltz-2.

    Args:
        request: Request containing protein sequence and optional ligand information

    Returns:
        Boltz2Response with prediction results

    Raises:
        HTTPException: For various error conditions
    """
    try:
        fold_result = await fold_boltz2(
            request.sequence,
            request.ligand_smiles,
            request.recycling_steps,
            request.sampling_steps,
            request.diffusion_samples,
        )
        return Boltz2Response(results=[fold_result])
    except ProteinFoldingError as e:
        logging.error(f"Boltz-2 error: {e.message}")
        raise handle_protein_folding_exception(e)
    except Exception as e:
        logging.error(f"Unexpected error in Boltz-2: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during Boltz-2 processing",
        )
