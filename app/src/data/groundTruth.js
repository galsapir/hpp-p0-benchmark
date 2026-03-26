// ABOUTME: Ground truth CGM metrics and model metadata for the benchmark patient.
// ABOUTME: Powers fact-checking overlays and accuracy comparisons.

export const groundTruth = {
  mean_glucose_mgdl: 157.3,
  tir_70_180_pct: 75.8,
  tar_above_180_pct: 24.2,
  tar_above_140_pct: 67.4,
  tar_above_250_pct: 0.8,
  time_below_70_pct: 0.0,
  cv_pct: 21.5,
  mage_mgdl: 84.7,
  gmi_pct: 7.1,
  sd_mgdl: 33.8,
  max_glucose_mgdl: 271.8,
  min_glucose_mgdl: 77.4,
  hypo_episodes: 0,
  hyper_episodes_lv1: 51,
  hyper_episodes_lv2: 5,
  active_days: 12.9,
};

export const patient = {
  age: '66.4 years',
  sex: 'Male',
  bmi: '28.4 (overweight)',
  hba1c: '7.6%',
  fastingGlucose: '170 mg/dL',
  cgmDuration: '12.9 days',
  cgmReadings: '1,249 readings',
  dietEntries: '214 food entries',
};

export const models = [
  { id: 'hpp', name: 'HPP (P0)', slug: 'hpp', color: '#00dfa2', isHpp: true },
  { id: 'gpt54', name: 'GPT-5.4', slug: 'gpt54', color: '#74aa9c' },
  { id: 'claude', name: 'Claude Opus 4.6', slug: 'claude', color: '#d4a574' },
  { id: 'gemini', name: 'Gemini 3.1 Pro', slug: 'gemini', color: '#8b9cf7' },
  { id: 'perplexity', name: 'Sonar Pro', slug: 'perplexity', color: '#20b2aa' },
];

export const fileMap = {
  promptA: {
    hpp: '04_prompt_a_response_HPP.md',
    gpt54: '05_prompt_a_response_GPT54.md',
    claude: '06_prompt_a_response_Claude_Opus.md',
    gemini: '07_prompt_a_response_Gemini_31_Pro.md',
    perplexity: '08_prompt_a_response_Sonar_Pro.md',
  },
  promptB: {
    hpp: '09_prompt_b_response_HPP.md',
    gpt54: '10_prompt_b_response_GPT54.md',
    claude: '11_prompt_b_response_Claude_Opus.md',
    gemini: '12_prompt_b_response_Gemini_31_Pro.md',
    perplexity: '13_prompt_b_response_Sonar_Pro.md',
  },
};

export const accuracyPromptA = [
  { model: 'HPP (P0)', claims: 10, correct: 10, accuracy: 100, worst: 'None' },
  { model: 'GPT-5.4', claims: 5, correct: 4, accuracy: 80, worst: 'TAR >140 off by 17 pts' },
  { model: 'Claude Opus', claims: 6, correct: 3, accuracy: 50, worst: 'TIR off by 8 pts' },
  { model: 'Gemini', claims: 5, correct: 2, accuracy: 40, worst: '"F Critical" for near-target TIR' },
  { model: 'Sonar Pro', claims: 4, correct: 2, accuracy: 50, worst: 'TAR >180 off by 11 pts' },
];

export const latencyData = {
  promptA: [
    { model: 'HPP (P0)', seconds: 199, tools: 12 },
    { model: 'GPT-5.4', seconds: 13 },
    { model: 'Claude Opus', seconds: 22 },
    { model: 'Gemini', seconds: 25 },
    { model: 'Sonar Pro', seconds: 7 },
  ],
  promptB: [
    { model: 'HPP (P0)', seconds: 209, tools: 12 },
    { model: 'GPT-5.4', seconds: 25 },
    { model: 'Claude Opus', seconds: 41 },
    { model: 'Gemini', seconds: 71 },
    { model: 'Sonar Pro', seconds: 11 },
  ],
};

export const tokenData = [
  { model: 'GPT-5.4', prompt: 63989, completion: 1242, total: 65231 },
  { model: 'Claude Opus', prompt: 66191, completion: 1539, total: 67730 },
  { model: 'Gemini', prompt: 98863, completion: 2943, total: 101806 },
  { model: 'Sonar Pro', prompt: 63937, completion: 673, total: 64610 },
];

export const capabilityMatrix = [
  { capability: 'Population percentiles', hpp: true, gpt54: false, claude: false, gemini: false, perplexity: false },
  { capability: 'Predictive models (R²/AUC)', hpp: true, gpt54: false, claude: false, gemini: false, perplexity: false },
  { capability: 'Meal PPGR computation', hpp: true, gpt54: false, claude: false, gemini: false, perplexity: false },
  { capability: 'Literature citations', hpp: true, gpt54: false, claude: false, gemini: false, perplexity: false },
  { capability: 'Confidence disclosure', hpp: true, gpt54: false, claude: false, gemini: false, perplexity: false },
  { capability: 'Refuses without data', hpp: true, gpt54: false, claude: false, gemini: false, perplexity: false },
  { capability: 'Diet pattern recognition', hpp: false, gpt54: true, claude: true, gemini: false, perplexity: false },
  { capability: 'Dawn phenomenon detection', hpp: false, gpt54: false, claude: true, gemini: false, perplexity: false },
];
