from __future__ import annotations

import re
from typing import Any

TOKEN_PATTERN = re.compile(r"[\w'-]{2,}", re.UNICODE)
NUMBER_PATTERN = re.compile(r"(?<!\w)\d+(?:[.,]\d+)?%?(?!\w)")
NEGATION_TERMS = {"not", "no", "never", "without", "cannot", "isn't", "doesn't", "aren't", "wasn't"}
STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "been", "by", "for", "from", "in", "is",
    "it", "of", "on", "or", "the", "this", "that", "to", "was", "were", "with",
}
AMBIGUOUS_PATTERNS = (
    re.compile(r"^(what is it|is it safe|is this safe|does it work|should i use it|compare these|which one)\??$", re.I),
    re.compile(r"^(compare|explain|check|verify)\s+(this|that|it|these|those)\s*[?.!]*$", re.I),
    re.compile(r"^(is|was|does|did|can|should)\s+(it|this|that)\s+(safe|correct|legal|allowed|good)\??$", re.I),
)


def _tokens(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_PATTERN.findall(text) if token.lower() not in STOP_WORDS]


def _numbers(text: str) -> set[str]:
    return {value.replace(",", ".") for value in NUMBER_PATTERN.findall(text)}


def _polarity(text: str) -> bool:
    return not any(token in NEGATION_TERMS for token in _tokens(text))


def _overlap(left: set[str], right: set[str]) -> float:
    return len(left & right) / len(left) if left else 0.0


def _numbers_in_order(text: str) -> list[str]:
    return [value.replace(",", ".") for value in NUMBER_PATTERN.findall(text)]


def _predicate_terms(tokens: list[str]) -> set[str]:
    predicate_markers = {
        "is", "are", "was", "were", "has", "have", "does", "did", "can",
        "causes", "caused", "contains", "located", "founded", "launched",
        "created", "uses", "used", "provides", "supports", "encrypts",
        "boils", "equals", "means", "includes", "requires", "allows",
    }
    return marked | set(tokens[1:]) if (marked := {token for token in tokens if token in predicate_markers}) else set(tokens[1:])


def _claim_evidence_features(claim: str, evidence: str) -> dict[str, Any]:
    claim_token_list = _tokens(claim)
    claim_tokens = set(claim_token_list)
    evidence_tokens = set(_tokens(evidence))
    predicate = _predicate_terms(claim_token_list)
    anchor_candidates = [token for token in claim_token_list if len(token) >= 2]
    anchor_shared = set(anchor_candidates) & evidence_tokens
    claim_numbers = _numbers_in_order(claim)
    evidence_numbers = _numbers_in_order(evidence)
    return {
        "term_overlap": round(_overlap(claim_tokens, evidence_tokens), 3),
        "predicate_overlap": round(_overlap(predicate, evidence_tokens), 3),
        "anchor_overlap": round(len(anchor_shared) / len(anchor_candidates), 3) if anchor_candidates else 0.0,
        "number_match": bool(claim_numbers) and all(number in evidence_numbers for number in claim_numbers),
        "polarity_match": _polarity(claim) == _polarity(evidence),
        "claim_numbers": claim_numbers,
        "evidence_numbers": evidence_numbers,
    }


class AmbiguityDetector:
    def inspect(self, task: str) -> dict[str, Any] | None:
        normalized = re.sub(r"\s+", " ", task.strip())
        if any(pattern.fullmatch(normalized) for pattern in AMBIGUOUS_PATTERNS):
            return {
                "kind": "missing_referent_or_scope",
                "reason": "The request does not identify the subject or scope needed for a reliable check.",
                "questions": ["What specific subject or claim should be checked?", "What context or time range should apply?"],
            }
        if re.search(r"\b(compare|difference between)\b", normalized, re.I) and re.search(r"\b(these|them|both|the two)\b", normalized, re.I):
            return {
                "kind": "missing_comparison_items",
                "reason": "The comparison items are not named in the request.",
                "questions": ["Which two items should be compared?"],
            }
        if re.fullmatch(r"(verify|check|explain|describe)\s+(it|this|that|them|these|those)[?.!]*", normalized, re.I):
            return {
                "kind": "missing_referent",
                "reason": "The request uses a pronoun without identifying the claim or subject to verify.",
                "questions": ["What exact claim or subject should be checked?"],
            }
        if re.fullmatch(r"(what|which|where|when|why|how)\s+is\s+(it|this|that)[?.!]*", normalized, re.I):
            return {
                "kind": "missing_referent",
                "reason": "The request does not identify the subject needed for a reliable check.",
                "questions": ["What specific subject are you referring to?"],
            }
        return None


class ContradictionEngine:
    def analyze(self, claims: list[str], sources: list[dict[str, str]]) -> list[dict[str, Any]]:
        conflicts: list[dict[str, Any]] = []
        source_data = [(index, source, set(_tokens(source.get("snippet", "")))) for index, source in enumerate(sources)]

        for claim_index, claim in enumerate(claims):
            claim_terms = set(_tokens(claim))
            claim_numbers = _numbers(claim)
            for source_index, source, source_terms in source_data:
                shared = claim_terms & source_terms
                number_conflict = bool(claim_numbers and _numbers(source.get("snippet", "")) and claim_numbers.isdisjoint(_numbers(source.get("snippet", ""))))
                polarity_conflict = bool(shared and _polarity(claim) != _polarity(source.get("snippet", "")))
                if shared and (number_conflict or (len(shared) >= 2 and polarity_conflict)):
                    conflicts.append({
                        "type": "claim_evidence_conflict",
                        "claim_index": claim_index,
                        "source_indices": [source_index],
                        "claim": claim,
                        "evidence": [source.get("snippet", "")[:400]],
                        "reason": "Claim values or polarity conflict with a related source passage.",
                    })

        for left in range(len(source_data)):
            left_index, left_source, left_terms = source_data[left]
            for right in range(left + 1, len(source_data)):
                right_index, right_source, right_terms = source_data[right]
                shared = left_terms & right_terms
                left_numbers = _numbers(left_source.get("snippet", ""))
                right_numbers = _numbers(right_source.get("snippet", ""))
                values_conflict = bool(left_numbers and right_numbers and left_numbers.isdisjoint(right_numbers))
                polarity_conflict = bool(len(shared) >= 2 and _polarity(left_source.get("snippet", "")) != _polarity(right_source.get("snippet", "")))
                if len(shared) >= 2 and (values_conflict or polarity_conflict):
                    conflicts.append({
                        "type": "source_source_conflict",
                        "claim_index": None,
                        "source_indices": [left_index, right_index],
                        "claim": "",
                        "evidence": [left_source.get("snippet", "")[:400], right_source.get("snippet", "")[:400]],
                        "reason": "Related retrieved sources disagree on numeric values or polarity.",
                    })

        for left in range(len(claims)):
            for right in range(left + 1, len(claims)):
                left_terms = set(_tokens(claims[left]))
                right_terms = set(_tokens(claims[right]))
                shared = left_terms & right_terms
                values_conflict = bool(_numbers(claims[left]) and _numbers(claims[right]) and _numbers(claims[left]).isdisjoint(_numbers(claims[right])))
                polarity_conflict = bool(len(shared) >= 2 and _polarity(claims[left]) != _polarity(claims[right]))
                if len(shared) >= 2 and (values_conflict or polarity_conflict):
                    conflicts.append({
                        "type": "claim_claim_conflict",
                        "claim_indices": [left, right],
                        "source_indices": [],
                        "claim": claims[left],
                        "evidence": [claims[left], claims[right]],
                        "reason": "Extracted claims disagree on numeric values or polarity.",
                    })
        return conflicts


class IndependentVerifier:
    """Deterministic claim/evidence verifier; stronger than raw lexical overlap, but still heuristic."""

    def __init__(self, contradiction_engine: ContradictionEngine | None = None) -> None:
        self.contradiction_engine = contradiction_engine or ContradictionEngine()

    def verify(self, claims: list[str], sources: list[dict[str, str]]) -> list[dict[str, Any]]:
        contradictions = self.contradiction_engine.analyze(claims, sources)
        results: list[dict[str, Any]] = []
        for claim_index, claim in enumerate(claims):
            evidence: list[dict[str, Any]] = []
            best = None
            for source_index, source in enumerate(sources):
                features = _claim_evidence_features(claim, source.get("snippet", ""))
                if features["term_overlap"] > 0:
                    item = {
                        "source_index": source_index,
                        "score": features["term_overlap"],
                        "excerpt": source.get("snippet", "")[:400],
                        "verification_features": features,
                    }
                    evidence.append(item)
                    if best is None or (
                        features["anchor_overlap"], features["predicate_overlap"], features["term_overlap"]
                    ) > (
                        best["verification_features"]["anchor_overlap"],
                        best["verification_features"]["predicate_overlap"],
                        best["verification_features"]["term_overlap"],
                    ):
                        best = item

            conflicts = [c for c in contradictions if c.get("claim_index") == claim_index]
            features = best["verification_features"] if best else {
                "term_overlap": 0.0, "predicate_overlap": 0.0, "anchor_overlap": 0.0,
                "number_match": False, "polarity_match": True,
                "claim_numbers": _numbers_in_order(claim), "evidence_numbers": [],
            }

            if conflicts:
                status = "CONFLICT"
                reason = "Related evidence contains a conflicting value or polarity; the conflicting passage is retained."
            elif not evidence:
                status = "UNSUPPORTED"
                reason = "No retrieved source passage shares enough claim content to support the assertion."
            elif (
                features["anchor_overlap"] >= 0.5
                and features["predicate_overlap"] >= 0.5
                and (not features["claim_numbers"] or features["number_match"])
                and features["polarity_match"]
            ):
                status = "SUPPORTED"
                reason = "Claim content, predicate relationship, and required values/polarity align in the strongest source passage."
            elif features["term_overlap"] >= 0.15 and (
                features["predicate_overlap"] < 0.35
                or features["anchor_overlap"] < 0.35
                or (features["claim_numbers"] and not features["number_match"])
            ):
                status = "MISLEADING"
                reason = "The evidence is topically related but does not support the claim's predicate, anchors, or stated values."
            elif features["term_overlap"] >= 0.25:
                status = "PARTIAL"
                reason = "The evidence is relevant but does not contain enough claim-level relationship information for acceptance."
            else:
                status = "UNSUPPORTED"
                reason = "Retrieved evidence has insufficient claim-level alignment."

            results.append({
                "text": claim,
                "status": status,
                "support": round(features["term_overlap"], 2),
                "predicate_support": round(features["predicate_overlap"], 2),
                "anchor_support": round(features["anchor_overlap"], 2),
                "evidence": evidence,
                "reason": reason,
                "verification_method": "deterministic_claim_evidence_v2",
                "verification_path": {
                    "claim": claim,
                    "strongest_evidence": best["source_index"] if best else None,
                    "features": features,
                },
            })
        return results



class DecisionGate:
    ACTIONS = {"ACCEPT", "CORRECT", "REQUEST_MORE_EVIDENCE", "REJECT", "ABSTAIN"}

    def decide(
        self,
        status: str,
        reason: str,
        confidence: float,
        claims: list[dict[str, Any]],
        sources: list[dict[str, str]],
        failed_checks: list[str] | None = None,
        trace: list[str] | None = None,
        corrected_and_reverified: bool = False,
    ) -> dict[str, Any]:
        if status in {"UNSAFE", "CONFLICT", "UNSUPPORTED", "MISLEADING", "INVALID TOOL", "TOOL REJECTED"}:
            action = "REJECT"
        elif status == "CORRECTED" and corrected_and_reverified:
            action = "CORRECT"
        elif status in {"AMBIGUOUS", "PARTIALLY SUPPORTED", "PARTIAL"}:
            action = "REQUEST_MORE_EVIDENCE"
        elif status in {"INSUFFICIENT EVIDENCE", "ABSTAIN"}:
            action = "ABSTAIN"
        else:
            action = "ACCEPT"
        if action not in self.ACTIONS:
            raise ValueError("Decision gate produced an unsupported action.")
        affected = [claim["text"] for claim in claims if claim.get("status") in {"CONFLICT", "UNSUPPORTED", "MISLEADING", "PARTIAL"}]
        return {
            "action": action,
            "reason": reason,
            "confidence": round(max(0.0, min(1.0, confidence)), 2),
            "failed_checks": failed_checks or [],
            "evidence": sources,
            "affected_claims": affected,
            "trace": trace or ["VERIFICATION", f"DECISION: {action}"],
        }


class SelfCorrectionLoop:
    def run(
        self,
        failed_claims: list[str],
        original_answer: str,
        proposed_answer: str,
        extract_claims: Any,
        verify_claims: Any,
    ) -> dict[str, Any]:
        history = [{
            "step": "FAILURE",
            "answer": original_answer,
            "claims": failed_claims,
        }]
        history.append({"step": "CORRECT", "answer": proposed_answer})
        claims = extract_claims(proposed_answer)
        history.append({"step": "RE-EXTRACT CLAIMS", "claims": claims})
        verification = verify_claims(claims)
        success = bool(verification) and all(item.get("status") == "SUPPORTED" for item in verification)
        history.append({
            "step": "RE-VERIFY",
            "claims": verification,
            "passed": success,
        })
        history.append({"step": "DECISION", "action": "CORRECT" if success else "REQUEST_MORE_EVIDENCE"})
        return {
            "history": history,
            "claims": claims,
            "verification": verification,
            "success": success,
        }


def build_proof_graph(claims: list[dict[str, Any]], sources: list[dict[str, str]], verifications: list[str], decision: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    nodes: list[dict[str, Any]] = []
    edges: list[dict[str, str]] = []
    for claim_index, claim in enumerate(claims):
        claim_id = f"claim-{claim_index + 1}"
        nodes.append({"id": claim_id, "type": "claim", "label": claim.get("text", ""), "status": claim.get("status", "UNKNOWN")})
        for evidence_ref in claim.get("evidence", []):
            source_index = evidence_ref.get("source_index")
            if source_index is not None and 0 <= source_index < len(sources):
                source_id = f"evidence-{source_index + 1}"
                if not any(node["id"] == source_id for node in nodes):
                    source = sources[source_index]
                    nodes.append({"id": source_id, "type": "evidence", "label": source.get("title", "Source"), "url": source.get("url", "")})
                edges.append({"from": claim_id, "to": source_id})
                edges.append({"from": source_id, "to": f"verification-{claim_index + 1}"})
        verify_id = f"verification-{claim_index + 1}"
        nodes.append({
            "id": verify_id,
            "type": "verification",
            "label": claim.get("reason", ""),
            "status": claim.get("status", "UNKNOWN"),
            "method": claim.get("verification_method", "unknown"),
            "features": claim.get("verification_path", {}).get("features", {}),
        })
        if not claim.get("evidence"):
            edges.append({"from": claim_id, "to": verify_id})
        edges.append({"from": verify_id, "to": "decision"})
    nodes.append({
        "id": "decision",
        "type": "decision",
        "label": decision["action"],
        "status": decision["action"],
        "reason": decision.get("reason", ""),
        "confidence": decision.get("confidence", 0.0),
        "failed_checks": decision.get("failed_checks", []),
        "affected_claims": decision.get("affected_claims", []),
    })
    return {"nodes": nodes, "edges": edges}
