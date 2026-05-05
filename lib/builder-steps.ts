export const builderSteps = [
  { id: "identity", label: "Identity" },
  { id: "company", label: "Company" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
  { id: "design", label: "Design" },
  { id: "review", label: "Review" },
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