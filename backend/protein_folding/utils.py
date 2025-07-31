from typing import List
from collections import defaultdict


def calculate_plddt(protein_structure: str) -> List[float]:
    """
    Extract pLDDT scores from a PDB structure string.

    In AlphaFold/ESMFold PDB files, the B-factor column contains pLDDT scores.
    This function extracts and averages these scores per residue.

    Args:
        protein_structure: PDB format string containing the protein structure

    Returns:
        List of pLDDT scores (0-100) ordered by residue index
    """
    # Map to collect pLDDT scores per residue (1-based indexing)
    residue_to_scores = defaultdict(list)

    for line in protein_structure.splitlines():
        if line.startswith("ATOM"):
            # In a PDB file:
            # - Columns 23-26 (indices 22:26 in zero-based Python indexing)
            #   contain the residue index
            # - Columns 61-66 (indices 60:66 in zero-based Python indexing)
            #   contain the temperature factor (B-factor) field,
            #   which is used to store the pLDDT score in the case of AlphaFold/ESMFold
            #   Since the plddt is assigned to multiple atoms in a residue, we take the average
            try:
                # ESMFold stores pLDDT as values between 0 and 1, need to multiply by 100
                score = float(line[60:66].strip()) * 100
                residue_idx = int(line[22:26].strip())
                residue_to_scores[residue_idx].append(score)
            except (ValueError, IndexError):
                # Skip lines with parsing errors
                continue

    plddt_scores = []
    for residue_idx in sorted(residue_to_scores.keys()):
        scores = residue_to_scores[residue_idx]
        avg_score = sum(scores) / len(scores)
        plddt_scores.append(avg_score)

    return plddt_scores
