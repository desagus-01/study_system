# Learning science notes

Status: research background.

Related docs: `LEARNING.md`, `RETRIEVAL_AND_SCHEDULING.md`, `EVALUATION.md`.

This file preserves research rationale in implementation-friendly form. It is not itself an implementation contract.

## Retrieval practice

Research on test-enhanced learning and retrieval practice supports treating retrieval as a learning activity, not merely assessment.

Implementation consequence: Pi Learn should make cold retrieval and reconstruction first-class workflows, and should not infer durable learning from source-visible study alone.

## Concept mapping

Concept and knowledge maps have evidence for supporting retention, but results vary by how maps are constructed and used.

Implementation consequence: maps are justified, but the learner should do the constructive work and maps should be followed by source-hidden reconstruction/retrieval.

## Spacing

Spacing effects depend on desired retention horizon. Longer desired retention generally calls for longer gaps.

Implementation consequence: V0.1 can use an auditable interval ladder; future schedulers should include retention horizon and calibration metrics.

## Interleaving

Interleaving is most useful when it trains discrimination between confusable problem types or methods.

Implementation consequence: mixed review should target method selection and contrast sets, not random unrelated shuffling.

## Self-explanation

Self-explanation supports integration of declarative knowledge and principles.

Implementation consequence: teach-back and “why does this edge exist?” tasks are core learning activities.

## Worked-example fading and expertise reversal

Guidance should adapt as competence changes. Too much guidance can become redundant or counterproductive for more advanced learners.

Implementation consequence: use progressive assistance levels and keep correctness separate from independence.

## LLM assessment limitations

LLM grading and feedback can be useful but may produce unsupported claims or weaker results than specialised systems.

Implementation consequence: use structured diagnostic passes, source evidence, backend validation and gold-set evaluation.

## iCanStudy / Justin Sung inspiration

Public iCanStudy/Sung material supports learner-generated organisation, explicit relationships, interleaving, spaced retrieval and cognitive-load awareness, but the full branded programme should be treated as design inspiration rather than independently validated as a whole.

Implementation consequence: adopt compatible practices as testable product hypotheses and measure delayed independent outcomes.
