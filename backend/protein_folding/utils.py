from typing import List
from collections import defaultdict


def calculate_plddt(protein_structure: str) -> List[float]:
    """
    Extract pLDDT scores from a protein structure string (PDB or mmCIF format).

    Auto-detects the format and uses the appropriate parser.
    In both formats, the B-factor column contains pLDDT scores.
    This function extracts and averages these scores per residue.

    Args:
        protein_structure: PDB or mmCIF format string containing the protein structure

    Returns:
        List of pLDDT scores (0-100) ordered by residue index
    """
    # Auto-detect format
    if protein_structure.strip().startswith("data_"):
        # mmCIF format starts with data_<identifier>
        return calculate_plddt_from_mmcif(protein_structure)
    else:
        # Assume PDB format
        return calculate_plddt_from_pdb(protein_structure)


def calculate_plddt_from_pdb(protein_structure: str) -> List[float]:
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


def calculate_plddt_from_mmcif(mmcif_structure: str) -> List[float]:
    """
    Extract pLDDT scores from an mmCIF structure string.

    In mmCIF format, pLDDT scores are stored in the B-factor equivalent field
    (_atom_site.B_iso_or_equiv). This function extracts and averages these scores per residue.

    Args:
        mmcif_structure: mmCIF format string containing the protein structure

    Returns:
        List of pLDDT scores (0-100) ordered by residue index
    """
    lines = mmcif_structure.splitlines()

    # Find the _atom_site loop section
    atom_site_start = None
    atom_site_headers = []

    for i, line in enumerate(lines):
        if line.strip().startswith("_atom_site."):
            if atom_site_start is None:
                atom_site_start = i
            atom_site_headers.append(line.strip())
        elif atom_site_start is not None and (
            line.startswith("ATOM") or line.startswith("HETATM")
        ):
            break
        elif (
            atom_site_start is not None
            and line.strip()
            and not line.strip().startswith("_atom_site.")
        ):
            break

    if atom_site_start is None:
        return []

    # Find column indices for residue number and B-factor
    auth_seq_id_idx = None
    b_iso_idx = None

    for i, header in enumerate(atom_site_headers):
        if header == "_atom_site.auth_seq_id":
            auth_seq_id_idx = i
        elif header == "_atom_site.B_iso_or_equiv":
            b_iso_idx = i

    if auth_seq_id_idx is None or b_iso_idx is None:
        return []

    # Extract data from atom site records
    residue_to_scores = defaultdict(list)

    # Find where the data starts (after headers)
    data_start = atom_site_start + len(atom_site_headers)

    for line in lines[data_start:]:
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("_"):
            continue
        if line.startswith("loop_") or line.startswith("data_"):
            break

        # Split the line into fields
        fields = line.split()

        if len(fields) <= max(auth_seq_id_idx, b_iso_idx):
            continue

        try:
            residue_idx = int(fields[auth_seq_id_idx])
            # Boltz2 might store pLDDT as 0-1 or 0-100, check the range
            b_factor = float(fields[b_iso_idx])
            # If B-factor is between 0-1, multiply by 100 to get pLDDT percentage
            if b_factor <= 1.0:
                b_factor *= 100
            residue_to_scores[residue_idx].append(b_factor)
        except (ValueError, IndexError):
            continue

    # Calculate average pLDDT per residue and return sorted list
    plddt_scores = []
    for residue_idx in sorted(residue_to_scores.keys()):
        scores = residue_to_scores[residue_idx]
        avg_score = sum(scores) / len(scores)
        plddt_scores.append(avg_score)

    return plddt_scores
