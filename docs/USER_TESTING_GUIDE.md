# User Testing Guide — Lee Roo

**PUSL3122 HCI, Computer Graphics, and Visualisation**  
Industrial-standard procedure for conducting formative and summative user studies.

---

## 1. Overview

This guide describes how to conduct **formative** (during design) and **summative** (after implementation) user testing for the Lee Roo furniture visualization platform, aligned with coursework and industry best practices.

### Testing Types

| Type | Purpose | When |
|------|---------|------|
| **Formative** | Gather feedback on early designs (low/high-fidelity prototypes) | During design phase |
| **Summative** | Evaluate final system usability and effectiveness | After implementation |
| **Task-based** | Observe users completing specific tasks | Both formative and summative |
| **Think-aloud** | Users verbalize thoughts while interacting | Formative, exploratory |
| **System Usability Scale (SUS)** | Quantify perceived usability | Summative |

---

## 2. Participants

### Recruitment

- **Minimum:** 2 participants per study (per coursework brief)
- **Recommended:** 4–6 participants for reliable feedback
- **Exclusion:** No children; participants must give informed consent
- **Demographics:** Record age range, technical comfort, and domain familiarity (furniture retail, interior design)

### Consent

1. Provide a written consent form before the session
2. Explain purpose, duration, data use, and right to withdraw
3. Obtain signed consent (or documented verbal consent)
4. Never disclose participant identity in reports or submissions

---

## 3. Test Environment

### Setup

- Quiet room or controlled lab
- One facilitator per session
- Screen recording (with consent) for later analysis
- Note-taking for observed issues and quotes

### Equipment

- Desktop or laptop (primary use case)
- Optional: tablet for responsive testing
- Stable internet (Firebase, external assets)

---

## 4. Test Plan Template

### Pre-Session (5 min)

- Greet participant, explain purpose
- Obtain consent
- Brief demographic questionnaire

### Main Session (25–35 min)

**Task 1 — Browse & Add to Cart**

- "Find a sofa you like and add it to your cart"
- Observe: navigation, filter usage, product detail, add-to-cart flow

**Task 2 — Room Editor (2D)**

- "Create a new room design and place a sofa and coffee table"
- Observe: room setup, furniture drag-and-drop, scaling, colour change

**Task 3 — 3D View**

- "Switch to 3D view and inspect your design"
- Observe: view switching, orientation, performance

**Task 4 — Save & Export**

- "Save your design and export it as a PDF"
- Observe: save flow, export options, confirmation

### Post-Session (5–10 min)

- SUS questionnaire (10 items)
- Open-ended: "What worked well?", "What was confusing?"
- Thank participant

---

## 5. Metrics to Collect

| Metric | Method |
|--------|--------|
| Task completion rate | Success/failure per task |
| Time on task | Stopwatch or screen recording |
| Error count | Observed mistakes or hesitations |
| SUS score | Standard 10-question scale (0–100) |
| Qualitative feedback | Notes, quotes, think-aloud |

---

## 6. Analysis & Reporting

1. **Aggregate metrics** across participants
2. **List critical issues** (blocking or frequent)
3. **List minor issues** (cosmetic, rare)
4. **Prioritise improvements** by severity and frequency
5. **Link recommendations** to specific UI elements or workflows

### Example Recommendation Format

> **Issue:** Participants struggled to find the "Add to design" button on the product page.  
> **Evidence:** 3/4 participants hesitated >5 seconds; 1 abandoned.  
> **Recommendation:** Increase button prominence and add a tooltip.

---

## 7. Incorporating Feedback

1. Map each issue to a design/implementation change
2. Re-test critical fixes with at least one additional participant
3. Document before/after in the coursework report
4. Update this guide if procedures change

---

## References

- Nielsen, J. (2012). *How to Conduct a Heuristic Evaluation*
- Brooke, J. (1996). SUS: A quick and dirty usability scale
- ISO 9241-210:2019 — Human-centred design for interactive systems
- Coursework Brief — PUSL3122 Appendix A
