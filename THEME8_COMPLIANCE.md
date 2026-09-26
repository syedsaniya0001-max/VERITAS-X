# Theme 8 Compliance Checklist

Status reflects implemented and tested backend behavior, not UI-only presence.

| Requirement | Status | Evidence / limitation |
|---|---|---|
| Preserve existing Planner, Researcher, Reasoner, UI, fixtures, and tests | PASS | Existing modules and six original Attack Lab cards remain; original tests are retained and extended. |
| Specialized Planner / Researcher / Reasoner roles | PARTIAL | Retrieval and deterministic summary run without a model. Separate model prompts activate only when configured; all roles use the same provider/model. |
| Coder / tool-use responsibility | PASS | `ToolUseAgent` is a separate validation responsibility for allowlisted tool names, required fields, parameter types, bounded expressions, model requests/responses, source hosts, and structured tool errors. |
| Tool/API validation | PASS | Tool name, required fields, types, bounded parameters, source hosts, response schemas, model endpoint rules, and structured error schemas are validated before acceptance/execution. |
| Sandboxed execution | PARTIAL | `SandboxExecutor` supports bounded Decimal expressions only. It prevents arbitrary code execution but is not an OS/process sandbox. |
| Evidence retrieval and citations | PARTIAL | Live Wikipedia retrieval returns source links/snippets. Other providers, primary-source ranking, and durable evidence provenance are not implemented. |
| Independent claim verification | PARTIAL | Each claim is independently checked against each source using content anchors, predicate alignment, numeric agreement, polarity, and retained excerpts. It is still deterministic heuristic verification, not semantic entailment. |
| Misleading evidence detection | PARTIAL | Topic overlap without predicate support is labeled `MISLEADING`; heuristic limits remain. |
| Claim/evidence contradictions | PARTIAL | Tested numeric and polarity conflicts retain passages; semantic contradiction coverage remains heuristic. |
| Source/source contradictions | PARTIAL | Related passages with differing numeric values or polarity are detected heuristically; temporal scope and broad semantic conflicts are not resolved. |
| Claim/claim contradictions | PARTIAL | Numeric/polarity conflicts between extracted claims are detected and gated; general semantic conflicts remain heuristic. |
| Ambiguous input clarification | PARTIAL | Known missing-referent/comparison patterns return clarification questions; ambiguity detection is not general-purpose. |
| Insufficient evidence and abstention | PASS | Missing sources and unsupported claims fail closed to `ABSTAIN`; ambiguous/partial input can request more evidence, and source conflicts abstain. |
| Self-correction and re-verification | PARTIAL | Arithmetic and evidence-backed TLS corrections re-extract claims and re-verify before `CORRECT`; model critique can propose revisions when configured. General corrections depend on the optional model. |
| Central five-action decision gate | PASS | Returns `ACCEPT`, `CORRECT`, `REQUEST_MORE_EVIDENCE`, `REJECT`, or `ABSTAIN` plus reason, confidence, failed checks, evidence, affected claims, and trace. |
| Proof graph and audit | PARTIAL | Live runs populate claim → evidence → verification → decision data, including verification features and gate metadata, in the existing proof/audit views. It is an in-memory presentation, not durable audit storage. |
| Attack Lab integration | PARTIAL | The six original AX-01–AX-06 cards keep their original case meaning; additional backend cases cover unsupported/misleading evidence, ambiguity, incomplete evidence, calculation, schema, and invalid tools. All 15 run through the backend. These are controlled fixtures, not a broad adversarial corpus. |
| Evaluation metrics | PARTIAL | All requested verification metrics and per-metric numerators/denominators are calculated from the 15-case controlled corpus, including latency and self-correction. These values do not establish real-world accuracy. Generation quality is separately marked `NOT MEASURED`. |
| Existing benchmark fixtures preserved | PASS | Existing benchmark markup is retained; running it replaces the display with results from the pipeline fixture run. |
| Automated tests | PASS | `test_server.py` covers tool schemas, multilingual injection, misleading/contradictory evidence, ambiguity, abstention, correction/re-verification, decision actions, proof graph, and evaluation. |
| Public deployment URL | MISSING | No deployment has been created. |
| Public GitHub repository | MISSING | No public repository push has been performed. |
| Team/member details in README | PASS | Team TechNova and the three provided members/institute details are included. |
