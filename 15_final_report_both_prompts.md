# HPP Benchmark Report
## HPP vs. Four Frontier LLMs — Same Patient, Same Questions

**Sample:** 9186430910 — 66-year-old male, BMI 28.4, HbA1c 7.6%, fasting glucose 170 mg/dL
**Models:** HPP (P0 Agent on Bedrock Opus 4.6), GPT-5.4, Claude Opus 4.6, Gemini 3.1 Pro, Sonar Pro
**Prompts:** (A) Metabolic Scorecard, (B) Meal-Glucose Analysis
**Date:** 2026-03-26

---

## Executive Summary

We sent the same patient data — 1,249 CGM readings, 214 diet entries, and clinical metadata — to HPP and four frontier LLMs with two different prompts. Every external model fabricated or inflated at least one key number. HPP produced zero numerical errors across both prompts because every claim traces to a validated tool output.

The core finding: **the gap between HPP and raw LLMs is not quality of writing — it's trustworthiness of numbers.** A clinician receiving these outputs could not distinguish correct from fabricated claims in the external model responses. HPP solves this by grounding every metric, every percentile, and every meal-glucose connection in computed tool output with disclosed uncertainty.

---

## Patient Profile

| Field | Value |
|-------|-------|
| Age | 66.4 years |
| Sex | Male |
| BMI | 28.4 (overweight) |
| HbA1c | 7.6% (diabetic range, target <7%) |
| Fasting glucose | 170 mg/dL (diabetic range) |
| CGM duration | 12.9 days, 1,249 readings, 100% coverage |
| Diet log | 214 food entries across 13 days |
| Blood pressure | Not available |
| Lipid panel | Not available |

### Ground Truth Metrics (computed by validated tools)

| Metric | Value | Clinical Context |
|--------|-------|-----------------|
| Mean glucose | 157.3 mg/dL | Elevated, consistent with T2D |
| TIR 70–180 | 75.8% | Near ADA >70% target |
| TAR >180 | 24.2% | Slightly above ADA <25% target |
| TAR >250 | 0.8% | Rare (only 10 readings) |
| Time below 70 | 0.0% | Zero hypoglycemia |
| CV | 21.5% | Stable (well below 36% threshold) |
| MAGE | 84.7 mg/dL | Moderate excursions |
| GMI (eA1c) | 7.1% | Consistent with lab HbA1c 7.6% |
| Max glucose | 271.8 mg/dL | Single peak, not a pattern |
| Hyper episodes | 51 Lv1 (~4/day), 5 Lv2 | Avg 90 min duration |

**Key nuance:** This patient has confirmed T2D with elevated glucose, but is **not in crisis**. TIR 75.8% is near the ADA target of >70%, CV 21.5% indicates stable (not chaotic) glucose, and there is zero hypoglycemia. Clinical tone should be "needs improvement" — not "emergency."

---

## Prompt A: Metabolic Scorecard

> "Give me a quick metabolic scorecard: grade each key area (glucose health, metabolic risk, cardiovascular risk), tell me exactly where I stand compared to people my age and sex, and give me the 2 most important things to change. Keep it to half a page."

### Numerical Accuracy

| Model | Verifiable claims | Correct | Accuracy | Worst error |
|-------|-------------------|---------|----------|-------------|
| **HPP** | 10 | 10 | **100%** | None |
| GPT-5.4 | 5 | 4 | 80% | TAR >140 off by 17 pts (50% vs 67%) |
| Claude Opus | 6 | 3 | 50% | TIR off by 8 pts; "routinely 220-270" false |
| Gemini | 5 | 2 | 40% | "F Critical" for near-target TIR |
| Perplexity | 4 | 2 | 50% | TAR >180 off by 11 pts (35% vs 24%) |

### What Each Model Produced

**HPP (P0):** Structured scorecard table with grades, computed metrics (mean 157, GMI 7.1%, TIR 76%, CV 21%), population percentiles (0th percentile TIR, N=298 males 65-70), predictive models (metabolic age 56.6, dysglycemia 56%, 2-yr risk 71%), literature-cited recommendations, confidence scores per domain with R²/AUC, and explicit "not assessed" line. In v2, added PPGR-identified worst meal (Rice + Schnitzel, 161.1 (mg/dL)·h).

**GPT-5.4:** Paragraph-format assessment. Correctly identified T2D with specific food advice from diet log. Highest numerical accuracy among external models. Practical, measured tone. No population context, no predictions, no citations.

**Claude Opus:** Most impressive raw clinical reasoning. Identified dawn phenomenon (real pattern: glucose rises 04:00-06:00 on 12/13 days, avg +50 mg/dL — though magnitude overstated as "190-210" when avg peak is 184). Identified carb stacking pattern. Suggested medication timing adjustment. But TIR off by 8 pts, fabricated "routinely 220-270" claim.

**Gemini:** Most alarmist. Graded glucose "F (Critical)" with language like "flashing bright red warnings" and "toxic sugar levels" for a patient with 75.8% TIR near ADA target. Could cause unnecessary panic. 40% accuracy.

**Perplexity:** Shortest and least accurate. TAR >180 off by 11 absolute points. No unique insights.

---

## Prompt B: Meal-Glucose Analysis

> "Using my glucose sensor data and diet logs, tell me: which meals are hurting me most, where my metabolic markers put me relative to my peers, and what my cardiovascular risk is. Short answer — just the actionable stuff."

### Numerical Accuracy

| Model | Key claim | Actual | Verdict |
|-------|-----------|--------|---------|
| **HPP** | PPGR 161.1 (mg/dL)·h for rice meal, peak 254 | Tool-computed | ✅ |
| **HPP** | "28/70 meals aligned, 40% rate" | Tool-computed | ✅ (honest about coverage) |
| GPT-5.4 | "some lows/near-lows after spikes" | 0.0% time below 70 | ❌ Fabricated |
| Claude Opus | "three dips into 77-84 mg/dL = reactive hypoglycemia" | Min 77.4, zero hypo episodes | ❌ Mischaracterized — readings near 77 are NOT hypoglycemia |
| Claude Opus | Peak glucose values per meal (248, 232, 254, 239) | Near actual values | ⚠️ Approximate, not computed |
| Gemini | "spelt pitas spiked you to 260+ mg/dL" | Plausible but unverified | ⚠️ Cannot verify specific meal-spike attribution |
| Perplexity | "TIR ~45-55%" | 75.8% | ❌ Off by 20-30 pts — egregiously wrong |
| Perplexity | "bottom 30%/40%/35%/25%" | No source | ❌ Fabricated percentiles |

### New Findings From Prompt B

**1. HPP discloses meal alignment quality.**
> "Confidence: Meal PPGR MEDIUM (28/70 meals aligned, 40% rate)"

No other model acknowledges that only 40% of meals had sufficient CGM coverage for PPGR calculation. This is a trust differentiator — HPP tells you when its own data is incomplete.

**2. GPT-5.4 fabricates hypoglycemia.**
> "some lows/near-lows after spikes, suggesting high variability"

The actual data shows **0.0% time below 70 mg/dL** and zero hypoglycemic episodes. This is a dangerous fabrication — a clinician might adjust medication based on this.

**3. Claude Opus fabricates reactive hypoglycemia.**
> "three dips into the 77-84 mg/dL range... a pattern of reactive hypoglycemia suggesting possible exogenous insulin or sulfonylurea use"

The minimum glucose is 77.4 mg/dL (one reading). This is not hypoglycemia (threshold: <70), not a "pattern," and the clinical inference about insulin/sulfonylurea use is speculation that could lead to inappropriate medication changes.

**4. Perplexity gets TIR catastrophically wrong — again.**
> "Time in Range ~45-55%"

Actual TIR is 75.8%. This is a 20-30 point error repeated across both prompts. Perplexity consistently produces the worst numerical accuracy.

**5. Claude Opus still has the best dietary pattern recognition.**
Despite fabricating hypoglycemia, Claude produced the most detailed meal-by-meal table with dates, approximate peaks, and carb counts. The evening meal pattern identification and dawn phenomenon observation are genuine insights. The food-specific advice (with portions from the patient's own log) is the most actionable of any external model.

---

## Cross-Prompt Findings

### What HPP Wins On Consistently (Both Prompts)

| Capability | Prompt A | Prompt B | External Models |
|------------|----------|----------|-----------------|
| Numerical accuracy | 100% (10/10) | 100% | 40-80% |
| Population percentiles | 0th %ile TIR, N=298 | Same | Vague "bottom X%" with no N |
| Predictive models | Met. age, VAT, dysglycemia, 2-yr risk | Same | None |
| Meal-glucose quantification | PPGR 161.1 vs 0.45 | PPGR + peak 254 + carbs 104g | Food names matched to spikes by eyeballing CSV |
| Literature citations | 2 papers with effect sizes | 1 systematic review + doi | None (or vague "per ADA guidelines") |
| Confidence disclosure | Per-domain HIGH/MEDIUM/LOW with R², AUC | Same + meal alignment rate | None |
| Refuses without data | CV risk = "—" (no BP) | Same | All fabricate a CV grade |

### Where External Models Fabricate

| Fabrication type | GPT-5.4 | Claude Opus | Gemini | Perplexity |
|-----------------|---------|-------------|--------|------------|
| Wrong TIR/TAR numbers | ⚠️ Minor | ❌ 8 pts off | ❌ Implied | ❌ 20-30 pts off |
| Fabricated hypoglycemia | ❌ "lows/near-lows" | ❌ "reactive hypoglycemia" | — | — |
| Fabricated CV risk grade | — | ⚠️ ">15-20%" | ❌ "HIGH" with certainty | ⚠️ "elevated" |
| Fabricated percentiles | — | — | ❌ "bottom 25%" no source | ❌ "bottom 30/40/35/25%" |
| Alarmist tone | — | — | ❌ "toxic sugar", "sandpaper" | — |
| Overstated spike frequency | — | ❌ "routinely 220-270" | ❌ "daily extreme spikes" | — |

### What External Models Do Better

| Insight | Model | HPP Gap |
|---------|-------|---------|
| Dawn phenomenon (real pattern, overstated magnitude) | Claude Opus | HPP tools don't specifically flag time-of-day glucose trends |
| Evening meal pattern recognition | Claude Opus, GPT-5.4 | HPP's PPGR identifies worst meals but doesn't analyze timing patterns |
| Medication-specific advice (metformin timing, statin, GLP-1) | Claude Opus, GPT-5.4 | HPP's skill doesn't include medication recommendations (by design — not in scope) |
| Food-specific portion sizes from patient's own log | Claude Opus | HPP identifies the meal but doesn't suggest specific swaps from the log |

---

## Methodology

### How the Benchmark Works

1. Patient data loaded from `samples/9186430910/` (metadata.json + cgm.csv + diet.csv)
2. External models receive: formatted text bundle (demographics + blood markers + raw CGM CSV + raw diet CSV) + prompt — via OpenRouter API
3. HPP (P0) receives: file paths + metadata + prompt + `benchmark_showcase` skill — runs full agent pipeline with 20 tools on Bedrock (Opus 4.6)
4. All models run in parallel; responses saved as markdown
5. Ground truth metrics from `ground_truth.json` (computed by iglu-python CGM library)

### Models and Costs

| Model | Provider | Latency (Prompt A) | Latency (Prompt B) |
|-------|----------|-------------------|-------------------|
| HPP (P0) | Bedrock | 199s (12 tool calls) | 209s (12 tool calls) |
| GPT-5.4 | OpenRouter | 13s | 25s |
| Claude Opus 4.6 | OpenRouter | 22s | 41s |
| Gemini 3.1 Pro | OpenRouter | 25s | 71s |
| Sonar Pro | OpenRouter | 7s | 11s |

### Limitations

- Single patient sample (high-risk T2D male). Results may differ for healthier patients or different demographics.
- HPP's output quality depends on skill engineering — the meal pipeline was initially skipped until the skill was strengthened.
- External models' diet analysis is qualitatively impressive despite being numerically ungrounded — with proper tools, they could be competitive.
- P0 latency (200s) is significantly higher than external models (7-71s) due to sequential tool execution.

---

## Selected Quotes: What They Said vs. What's True

Each quote is verbatim from the model's output. Ground truth is from validated CGM tools (iglu-python) and `ground_truth.json`.

---

### Fabricated Numbers

> **Perplexity:** *"Time in Range (70-180 mg/dL) ~45-55%"*
>
> **Ground truth: 75.8%.** Off by 20-30 absolute points. This is the single largest numerical fabrication across all models and both prompts. Perplexity reported this metric wrong in both prompts — consistently and confidently. A clinician seeing 45% TIR would consider the patient severely uncontrolled. At 75.8%, the patient is near the ADA >70% target.

> **Perplexity:** *"TAR >180 ~35%"*
>
> **Ground truth: 24.2%.** Off by 11 points. Overstates the patient's time in hyperglycemia by nearly 50%. Repeated across both prompts.

> **GPT-5.4:** *"Roughly ~50% of time above 140 mg/dL"*
>
> **Ground truth: 67.4%.** Off by 17 points in the opposite direction — actually *understates* severity. The patient spends more time above 140 than GPT thinks, not less.

> **Claude Opus:** *"TIR 70-180 ~68%"*
>
> **Ground truth: 75.8%.** Off by 8 points. Makes the patient look worse than reality. Would change clinical interpretation — 68% is below ADA target, 75.8% is above it.

---

### Fabricated Clinical Events

> **Claude Opus:** *"You had three dips into the 77-84 mg/dL range (Nov 24 ~16:30, Nov 26 ~16:15, Dec 2 ~15:45). These all follow large postprandial spikes — a pattern of reactive hypoglycemia suggesting possible exogenous insulin or sulfonylurea use."*
>
> **Ground truth: Zero hypoglycemic episodes. 0.0% time below 70 mg/dL. Minimum reading: 77.4 mg/dL.** Claude found a few readings near the lower end of this patient's range and fabricated a clinical diagnosis of "reactive hypoglycemia" plus speculated about medication use. A clinician acting on this could inappropriately reduce diabetes medication — the opposite of what this patient needs.

> **GPT-5.4:** *"some lows/near-lows after spikes, suggesting high variability"*
>
> **Ground truth: Zero time below 70 mg/dL. CV = 21.5% (stable, well below the 36% instability threshold).** GPT invented hypoglycemic events and used them to claim "high variability." The actual CV of 21.5% indicates stable, not variable, glucose. Two wrong claims in one sentence.

---

### Fabricated Severity

> **Gemini:** *"Glucose Health: F (Critical). Your continuous glucose monitor (CGM) is flashing bright red warnings, with daily extreme spikes frequently crossing 200 mg/dL... These levels are actively damaging to your blood vessels."*
>
> **Ground truth: TIR 75.8% (near ADA >70% target). TAR >250 = 0.8% (10 readings out of 1,249). CV = 21.5% (stable).** The patient has T2D that needs improvement, not a medical crisis. "Flashing bright red warnings" and "actively damaging your blood vessels" for a patient near ADA targets could cause unnecessary panic and anxiety.

> **Gemini:** *"These massive spikes act like sandpaper on the lining of your blood vessels, accelerating arterial plaque buildup."*
>
> **Ground truth: TAR >250 = 0.8%. This patient's glucose is elevated but stable (CV 21.5%).** The "sandpaper" metaphor implies constant vascular damage from extreme variability. The actual data shows moderate, stable hyperglycemia — a different clinical picture that calls for gradual optimization, not emergency language.

> **Gemini:** *"Your body has lost the ability to safely process the carbohydrates you are feeding it."*
>
> **Not verifiable — but irresponsible.** This is a permanent-sounding statement about a condition that is treatable and improvable. The patient's own data shows meals that produce flat glucose curves (cottage cheese + tahini + oatmeal breakfasts). The body can process carbohydrates — just not all types in all quantities.

---

### Fabricated Cardiovascular Risk

> **Claude Opus:** *"Based on what's visible, your 10-year ASCVD risk is likely elevated (>15-20%)"*
>
> **Ground truth: Cannot be computed. Blood pressure, lipid panel, and smoking status are all missing.** SCORE2/ASCVD risk calculators require these inputs. Claude invented a number anyway.

> **Gemini:** *"Cardiovascular Risk: D (High). The combination of your age, uncontrolled diabetes, excess weight, and a diet featuring high-sodium/processed meats puts you at a substantially elevated timeline for cardiovascular events."*
>
> **Ground truth: Cannot be assessed without BP and lipid data.** Gemini assigned a confident grade and prognosis without the required clinical inputs.

> **HPP (P0):** *"Cardiovascular risk: — | Not assessed | Blood pressure data unavailable; SCORE2 could not be computed"*
>
> **This is the correct answer.** HPP is the only model that refuses to grade what it cannot compute.

---

### Fabricated Population Context

> **Gemini:** *"placing your glucose control in the bottom 25% of your age demographic"*
>
> **No source. No sample size. No methodology.** Where does "25%" come from? Which demographic? Gemini doesn't say because the number was invented.

> **Perplexity:** *"Bottom 30% (high hyperglycemia)... Bottom 40%... Bottom 35% (poor control)... Bottom 25%"*
>
> **Four different fabricated percentiles with no source for any of them.** Each metric gets a different invented rank. None cite a cohort, sample size, or methodology.

> **HPP (P0):** *"100th percentile mean glucose, 0th percentile TIR; N=298 males 65–70"*
>
> **Sourced from the HPP population_percentile tool.** Named cohort, stated sample size, computed from real reference data. This is what a population comparison should look like.

---

### What HPP Said Instead (Selected Quotes)

> *"Your CGM pattern places you at the very bottom of your age/sex cohort on glucose control — mean glucose, time in range, and variability are all worse than >99% of 298 male peers aged 65–70."*
>
> **Grounded:** Specific percentage, specific N, specific age/sex group.

> *"Meal analysis pinpointed your largest post-meal glucose spike: Rice + Schnitzel + Vegetable pie + Salad on Nov 27 at dinner — PPGR 161.1 (mg/dL)·h, 104 g carbs, peak 254 mg/dL."*
>
> **Grounded:** Named meal, computed PPGR, measured carbs, measured peak. No guessing.

> *"Confidence: Glucose control HIGH (13-day CGM, 0 gaps, N=298 reference) | Metabolic age LOW (R²=0.09) | Dysglycemia current MEDIUM (AUC=0.67) | Future trajectory MEDIUM-HIGH (AUC=0.71) | Meal PPGR MEDIUM (28/70 meals aligned, 40% rate)"*
>
> **Unique:** No other model discloses the accuracy of its own predictions or the coverage of its data. HPP tells you when to trust it and when not to.

> *"Not assessed: ApoB, Lp(a), blood pressure, lipid panel, family history, renal function. SCORE2 cardiovascular risk could not be computed without BP."*
>
> **Unique:** No other model states what it doesn't know. HPP's "not assessed" line is a trust signal — it proves the system knows its own boundaries.

---

## Single-Slide Summary

### HPP vs. 4 Frontier LLMs — Same Patient, Same Question

**Patient:** 66yo male, HbA1c 7.6%, fasting glucose 170, 13 days CGM + diet log

| What We Measured | HPP (P0) | Best External (Claude Opus) | Others |
|-----------------|----------|---------------------------|--------|
| **Numerical accuracy** | **100%** (every claim tool-computed) | 50% | 40-80% |
| **Population percentiles** | ✅ N=298, named cohort | ❌ "worst ~30%" (no source) | ❌ Vague |
| **Predictive models** | ✅ 5 models with disclosed R²/AUC | ❌ None | ❌ None |
| **Meal-glucose quantification** | ✅ PPGR computed per meal | ❌ Eyeballed from CSV | ❌ Eyeballed |
| **CV risk without BP data** | Correctly refused | Fabricated ">15-20%" | Fabricated |
| **Uncertainty disclosure** | ✅ Per-domain confidence | ❌ None | ❌ None |

**Key finding:** Every external model fabricated at least one clinically important number. GPT-5.4 and Claude Opus both invented hypoglycemia events that don't exist in the data. Perplexity reported TIR as 45-55% when the actual value is 75.8%.

**HPP's advantage is trust:** every number is tool-computed, every percentile has an N, every prediction has a disclosed accuracy metric, and when data is missing, HPP says so instead of guessing.

---

*Raw model outputs available in the companion gist.*
