import logging
import httpx
import asyncio
from typing import Dict, Any, Optional
from protein_folding.models import Boltz2Result
from config import check_env_vars
from protein_folding.exceptions import (
    ProteinFoldingAPIError,
    ProteinSequenceValidationError,
    ProteinFoldingTimeoutError,
    ProteinFoldingConnectionError,
)

# Global configuration
env = check_env_vars()

INVOKE_URL = "https://health.api.nvidia.com/v1/biology/mit/boltz2/predict"
STATUS_URL = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/status/{task_id}"

HEADERS = {
    "Authorization": f"Bearer {env.NVIDIA_API_KEY}",
    "Content-Type": "application/json",
    "NVCF-POLL-SECONDS": "300",
}


async def make_nvcf_call(data: Dict[str, Any]) -> Dict:
    """Make a call to NVIDIA Cloud Functions with long-polling."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            INVOKE_URL,
            json=data,
            headers=HEADERS,
            timeout=400,
        )

        if response.status_code == 202:
            # Handle async processing
            task_id = response.headers.get("nvcf-reqid")
            while True:
                status_response = await client.get(
                    STATUS_URL.format(task_id=task_id),
                    headers=HEADERS,
                    timeout=400,
                )
                if status_response.status_code == 200:
                    return status_response.json()
                elif status_response.status_code in [400, 401, 404, 422, 500]:
                    raise ProteinFoldingAPIError(
                        f"Error while waiting for function: {status_response.text}",
                        status_response.status_code,
                    )
                await asyncio.sleep(5)
        elif response.status_code == 200:
            return response.json()
        else:
            raise ProteinFoldingAPIError(
                f"API error: {response.status_code} - {response.text}",
                response.status_code,
            )


def validate_boltz2_input(
    sequence: str,
    ligand_smiles: Optional[str] = None,
    recycling_steps: int = 1,
    sampling_steps: int = 50,
    diffusion_samples: int = 3,
):
    """Validate Boltz-2 input parameters."""

    if not sequence or not sequence.strip():
        raise ProteinSequenceValidationError("Protein sequence cannot be empty")

    valid_amino_acids = set("ACDEFGHIKLMNPQRSTVWY")

    sequence_upper = sequence.upper().strip()

    if not all(aa in valid_amino_acids for aa in sequence_upper):
        raise ProteinSequenceValidationError("Invalid amino acid characters")

    if ligand_smiles and len(ligand_smiles) > 500:
        raise ProteinSequenceValidationError("Ligand SMILES too long")


async def fold_boltz2(
    sequence: str,
    ligand_smiles: Optional[str] = None,
    recycling_steps: int = 1,
    sampling_steps: int = 50,
    diffusion_samples: int = 3,
) -> Boltz2Result:
    """
    Call Boltz-2 API to process protein structure prediction.

    Args:
        sequence: Protein sequence
        ligand_smiles: Optional SMILES notation for ligand
        recycling_steps: Number of recycling steps (default: 1)
        sampling_steps: Number of sampling steps (default: 50)
        diffusion_samples: Number of samples to generate (default: 3)

    Returns:
        Boltz2Result containing predicted structure and metadata

    Raises:
        ProteinSequenceValidationError: If input is invalid
        ProteinFoldingAPIError: If API returns an error
        ProteinFoldingTimeoutError: If request times out
        ProteinFoldingConnectionError: If connection fails
    """
    validate_boltz2_input(sequence, ligand_smiles)

    # Build ligands list if SMILES provided
    ligands_list = []
    if ligand_smiles:
        ligands_list.append(
            {"smiles": ligand_smiles, "id": "L1", "predict_affinity": True}
        )

    # Prepare API payload
    payload = {
        "diffusion_samples": diffusion_samples,
        "ligands": ligands_list,
        "polymers": [
            {
                "id": "A",
                "molecule_type": "protein",
                "msa": {
                    "uniref90": {
                        "a3m": {"alignment": f">seq1\n{sequence}", "format": "a3m"}
                    }
                },
                "sequence": sequence,
            }
        ],
        "recycling_steps": recycling_steps,
        "sampling_steps": sampling_steps,
        "step_scale": 1.2,
        "without_potentials": True,
    }

    try:
        response_data = await make_nvcf_call(payload)

        if env.DEBUG:
            logging.debug(f"Boltz-2 API response: {response_data}")

        # Extract and process results
        structures = response_data.get("structures", [])
        confidence_scores = response_data.get("confidence_scores", [])

        if not structures:
            raise ProteinFoldingAPIError("No structures returned", 500)

        # Extract structure data
        structure_data = structures[0]
        mmcif_string = structure_data.get("structure", "")
        structure_format = structure_data.get("format", "unknown")

        if env.DEBUG:
            logging.debug(f"Structure keys: {list(structure_data.keys())}")
            logging.debug(f"Structure format: {structure_format}")
            logging.debug(f"First few chars of structure: {mmcif_string[:100]}")

        if not mmcif_string:
            raise ProteinFoldingAPIError("No structure content found in response", 500)

        # Calculate pLDDT from mmCIF structure
        from protein_folding.utils import calculate_plddt

        plddt_scores = calculate_plddt(mmcif_string)

        return Boltz2Result(
            mmcif_string=mmcif_string,
            plddt=plddt_scores,
            confidence_scores=confidence_scores,
        )

    except httpx.TimeoutException:
        raise ProteinFoldingTimeoutError("Boltz-2 API request timed out")
    except httpx.ConnectError:
        raise ProteinFoldingConnectionError("Failed to connect to Boltz-2 API")
    except httpx.HTTPStatusError as e:
        raise ProteinFoldingAPIError(
            f"Boltz-2 API error: {e.response.status_code}",
            e.response.status_code,
        )
