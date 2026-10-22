export const categories = [
  "FOOD_SECURITY",
  "ENVIRONMENT",
  "YOUTH_COMMUNITY",
  "HOUSING_HEALTH",
  "ANIMAL_WELFARE",
  "SKILLS_BASED_VIRTUAL",
  "PUBLIC_SAFETY",
] as const;

export const categoryLabels: Record<(typeof categories)[number], string> = {
  FOOD_SECURITY: "Food & hunger",
  ENVIRONMENT: "Environment",
  YOUTH_COMMUNITY: "Youth & community",
  HOUSING_HEALTH: "Housing & health",
  ANIMAL_WELFARE: "Animal welfare",
  SKILLS_BASED_VIRTUAL: "Skills-based",
  PUBLIC_SAFETY: "Public safety",
};
