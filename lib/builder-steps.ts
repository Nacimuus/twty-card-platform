export const builderSteps = [
  { id: "identity", label: "Identité" },
  { id: "company", label: "Entreprise" },
  { id: "skills", label: "Compétences" },
  { id: "contact", label: "Contact" },
  { id: "design", label: "Style" },
  { id: "review", label: "Publication" },
];

export function getStepIndex(step: string) {
  return builderSteps.findIndex((item) => item.id === step);
}

export function getNextStep(step: string) {
  const index = getStepIndex(step);
  return builderSteps[index + 1]?.id || null;
}

export function getPreviousStep(step: string) {
  const index = getStepIndex(step);
  return builderSteps[index - 1]?.id || null;
}