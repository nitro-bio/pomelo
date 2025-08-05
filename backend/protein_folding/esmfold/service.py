import logging
import httpx
from protein_folding.models import EsmfoldResult
from protein_folding.utils import calculate_plddt
from config import check_env_vars
from protein_folding.exceptions import (
    ProteinFoldingAPIError,
    ProteinSequenceValidationError,
    ProteinFoldingTimeoutError,
    ProteinFoldingConnectionError,
)

# Global configuration
env = check_env_vars()

INVOKE_URL = "https://health.api.nvidia.com/v1/biology/nvidia/esmfold"
HEADERS = {
    "Authorization": f"Bearer {env.NVIDIA_API_KEY}",
    "Accept": "application/json",
}


def validate_sequence(sequence: str) -> None:
    """Validate protein sequence format."""
    if not sequence or not sequence.strip():
        raise ProteinSequenceValidationError("Protein sequence cannot be empty")

    # Basic validation - only allow amino acid letters
    valid_amino_acids = set("ACDEFGHIKLMNPQRSTVWY")
    sequence_upper = sequence.upper().strip()

    if not all(aa in valid_amino_acids for aa in sequence_upper):
        raise ProteinSequenceValidationError(
            "Protein sequence contains invalid amino acid characters. "
            "Only standard 20 amino acids are allowed."
        )


async def fold_with_esmfold(sequence: str) -> EsmfoldResult:
    """
    Call NVIDIA ESMFold API to fold a protein sequence.

    Args:
        sequence: Protein sequence string

    Returns:
        EsmfoldResult containing PDB structure and pLDDT scores

    Raises:
        ProteinSequenceValidationError: If sequence is invalid
        ProteinFoldingAPIError: If API returns an error
        ProteinFoldingTimeoutError: If request times out
        ProteinFoldingConnectionError: If connection fails
    """
    validate_sequence(sequence)

    payload = {"sequence": sequence.strip()}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                INVOKE_URL,
                headers=HEADERS,
                json=payload,
                timeout=300.0,  # 5 minute timeout for protein folding
            )

            response.raise_for_status()
            response_body = response.json()

        if env.DEBUG:
            logging.debug(f"ESMFold API response: {response_body}")

        if response_body is None:
            raise ValueError("Got empty response")

        # Extract PDB string and calculate pLDDT scores
        pdb_string = response_body["pdbs"][0]
        plddt_scores = calculate_plddt(pdb_string)

        # Return EsmfoldResult
        return EsmfoldResult(pdb=pdb_string, plddt=plddt_scores)

    except httpx.TimeoutException:
        raise ProteinFoldingTimeoutError("ESMFold API request timed out")
    except httpx.ConnectError:
        raise ProteinFoldingConnectionError("Failed to connect to ESMFold API")
    except httpx.HTTPStatusError as e:
        try:
            error_data = e.response.json() if e.response else None
        except ValueError:
            error_data = None

        raise ProteinFoldingAPIError(
            f"ESMFold API error: {e.response.status_code} - {e.response.reason_phrase}",
            e.response.status_code,
            error_data,
        )
    except httpx.RequestError as e:
        raise ProteinFoldingAPIError(f"Request failed: {str(e)}", 500)
