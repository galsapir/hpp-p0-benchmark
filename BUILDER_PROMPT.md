# Task: Build an Interactive Benchmark Showcase SPA

## What You're Building

A single-page web application that showcases a head-to-head benchmark comparison between **HPP** (our AI health analysis system) and **four frontier LLMs** (GPT-5.4, Claude Opus 4.6, Gemini 3.1 Pro, Perplexity Sonar Pro). The audience is our CEO — it needs to be polished, explorable, and tell a clear story: **HPP's outputs are grounded and trustworthy; the competitors fabricate numbers.**

This is an investor-grade demo. Make it beautiful.

---

## The Story

We gave all 5 models the same patient data (a 66-year-old male with Type 2 diabetes: 13 days of CGM readings, full diet log, blood markers) and asked them two questions:

- **Prompt A (Scorecard):** "Give me a quick metabolic scorecard: grade each key area, tell me where I stand compared to peers, 2 things to change. Half a page."
- **Prompt B (Meal-Glucose):** "Which meals are hurting me most, where do my markers put me relative to peers, and what's my cardiovascular risk? Just the actionable stuff."

HPP used 20 specialized tools (CGM analysis, population percentiles, predictive models, meal-glucose response calculators, literature search). The other models got raw CSV data and had to figure it out.

**Key finding:** Every external model fabricated at least one clinically important number. HPP produced zero numerical errors because every claim traces to a validated tool output.

---

## Data Files

All content is in `all_deliverables.json` — a single JSON file mapping filename → markdown/JSON content. Key files:

### Prompts (what was asked)
- `01_prompt_a_scorecard.md` — First prompt text
- `02_prompt_b_meal_grounded.md` — Second prompt text
- `03_prompt_c_investor_demo_unused.md` — Third prompt (not tested, included for reference)

### Prompt A Responses (5 models)
- `04_prompt_a_response_HPP.md`
- `05_prompt_a_response_GPT54.md`
- `06_prompt_a_response_Claude_Opus.md`
- `07_prompt_a_response_Gemini_31_Pro.md`
- `08_prompt_a_response_Sonar_Pro.md`

### Prompt B Responses (5 models)
- `09_prompt_b_response_HPP.md`
- `10_prompt_b_response_GPT54.md`
- `11_prompt_b_response_Claude_Opus.md`
- `12_prompt_b_response_Gemini_31_Pro.md`
- `13_prompt_b_response_Sonar_Pro.md`

### Analysis
- `14_comparison_prompt_a_detailed.md` — Detailed 10-section comparison for Prompt A
- `15_final_report_both_prompts.md` — **The main report** with both prompts, fact-checking tables, selected quotes section, and single-slide summary
- `16_input_data_sent_to_external_models.md` — The exact patient data bundle sent to external models
- `17_run_metadata_prompt_a.json` — Latency, token counts for Prompt A
- `18_run_metadata_prompt_b.json` — Latency, token counts for Prompt B

---

## Ground Truth Reference

These are the actual computed values for this patient (from validated CGM analysis tools). Use these to power the fact-checking overlays.

```json
{
  "mean_glucose_mgdl": 157.3,
  "tir_70_180_pct": 75.8,
  "tar_above_180_pct": 24.2,
  "tar_above_140_pct": 67.4,
  "tar_above_250_pct": 0.8,
  "time_below_70_pct": 0.0,
  "cv_pct": 21.5,
  "mage_mgdl": 84.7,
  "gmi_pct": 7.1,
  "sd_mgdl": 33.8,
  "max_glucose_mgdl": 271.8,
  "min_glucose_mgdl": 77.4,
  "hypo_episodes": 0,
  "hyper_episodes_lv1": 51,
  "hyper_episodes_lv2": 5,
  "active_days": 12.9
}
```

---

## Page Structure

### 1. Hero / Landing
- Patient profile card (age, sex, BMI, HbA1c, fasting glucose — one line)
- Headline: "HPP vs. 4 Frontier LLMs — Same Patient, Same Question"
- The key metric: "HPP: 100% numerical accuracy | Best competitor: 80% | Worst: 40%"
- Visual: accuracy bar chart or radar chart (5 models)

### 2. Side-by-Side Comparison View
The core of the app. Two modes:

**a) All models at once (overview):**
- 5 columns (or cards), one per model, showing the same prompt response
- Toggle between Prompt A and Prompt B
- HPP column should be visually distinct (e.g., subtle green border or badge)

**b) HPP vs. one model (deep dive):**
- Two-column diff-style view
- Dropdown to select which model to compare against
- This is where quote highlighting lives (see below)

### 3. Fact-Check Overlay
This is the killer feature. In the side-by-side view:

- **Red highlights** on fabricated/wrong claims in external model responses
- **Green highlights** on the corresponding correct claim in HPP's response
- **Tooltip/popover** on hover showing: the claim, the ground truth value, and the error magnitude
- Use the "Selected Quotes" section from `15_final_report_both_prompts.md` as the source for which quotes to highlight

Categories of fabrications to highlight:
1. **Wrong numbers** (red) — e.g., "TIR ~45-55%" when actual is 75.8%
2. **Fabricated events** (red) — e.g., "reactive hypoglycemia" when hypo episodes = 0
3. **Fabricated severity** (orange) — e.g., "F (Critical)" / "toxic sugar levels" for near-target TIR
4. **Fabricated CV risk** (orange) — grading CV without BP/lipid data
5. **Unverifiable claims** (yellow) — e.g., "bottom 25%" with no source

### 4. Selected Quotes Gallery
A scrollable section pulling directly from the "Selected Quotes" section in the final report. Each quote card shows:
- The verbatim quote (with model name/icon)
- The ground truth (with green checkmark)
- The error type (badge: "Fabricated Number", "Fabricated Event", "Alarmist Tone", etc.)

This section should feel like a "wall of shame" for the competitors — but professional, not snarky.

### 5. Metrics Dashboard
- Accuracy comparison table (from the report's numerical accuracy section)
- Model capability matrix (population percentiles, predictions, meal PPGR, confidence disclosure, etc.)
- Latency comparison (bar chart from run_metadata)
- Token usage comparison

### 6. HPP Advantages Section
The "5 differentiators" from the report, presented as feature cards:
1. Population context (N=298, named cohort)
2. Data grounding (tool-computed, not guessed)
3. Literature grounding (cited papers with effect sizes)
4. Validated risk scores (SCORE2 with disclosed AUC/R²)
5. Guardrails (confidence disclosure, "not assessed" line)

### 7. Raw Data Explorer (collapsible)
- The full input data bundle (markdown rendered)
- The patient profile
- Toggle to see what HPP's tools computed vs what external models received

---

## Design Guidelines

- **Color scheme:** Professional, clean. Dark text on light background. HPP = teal/green accent. Errors = red. Warnings = orange.
- **Typography:** System fonts or Inter/IBM Plex. Markdown content should render nicely (tables, bold, headers).
- **Responsive:** Should work on laptop screens (1280px+). Mobile is not required but don't break it.
- **Animations:** Subtle. Smooth transitions between views. No flashy effects.
- **Framework:** Use whatever makes this easiest — React, Vue, Svelte, or even vanilla HTML/CSS/JS with a markdown renderer. Keep it simple. No backend needed — all data is static JSON.
- **Deployment:** Should be deployable to GitHub Pages, Vercel, or Netlify with zero config.

---

## What Success Looks Like

Ori opens the page, sees the hero with the accuracy comparison, clicks into the side-by-side view, toggles between models, sees red highlights on fabricated claims with ground-truth tooltips, scrolls through the quotes gallery, and comes away thinking: "The other models are confidently wrong. HPP shows its work."

The page should be self-explanatory — no presentation needed. Ori should be able to explore it on his own and understand the story.

---

## Technical Notes

- All content is markdown — you'll need a markdown-to-HTML renderer (marked, markdown-it, or similar)
- The JSON data file is ~178KB — embed it directly, no API calls needed
- Tables in the markdown should render as actual HTML tables, not code blocks
- The "Selected Quotes" section in file 15 has the exact quotes and ground truth — parse these for the highlight/overlay feature
