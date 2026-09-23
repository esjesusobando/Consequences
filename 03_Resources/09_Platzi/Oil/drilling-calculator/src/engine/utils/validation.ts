/**
 * Drilling Engine - Armor Layer Validation Utils
 * Previene divisiones por cero y valores físicamente inválidos.
 */

export interface WellParams {
  mudWeight: number;
  sidpp: number;
  shoeTVD: number;
  fractureGradientAtShoe: number;
  safetyMargin: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateWellInput = (params: WellParams): ValidationResult => {
  const errors: string[] = [];
  if (params.shoeTVD <= 0) errors.push("shoeTVD must be positive");
  if (params.mudWeight <= 0) errors.push("mudWeight must be positive");
  if (params.fractureGradientAtShoe <= 0)
    errors.push("fractureGradientAtShoe must be positive");
  return { isValid: errors.length === 0, errors };
};

export const validateNumeric = (
  value: number | undefined | null,
  defaultValue: number = 0,
): number => {
  if (value === undefined || value === null || isNaN(value))
    return defaultValue;
  return value;
};

export const safeDivide = (
  numerator: number,
  denominator: number,
  fallback: number = 0,
): number => {
  if (denominator === 0 || isNaN(denominator)) return fallback;
  return numerator / denominator;
};

export const sanitizeEngineInput = {
  diameter: (val: number) => Math.max(0.0001, validateNumeric(val)),
  fluidDensity: (val: number) => Math.max(0.1, validateNumeric(val)),
  depth: (val: number) => Math.max(0, validateNumeric(val)),
  rheology: (val: number) => Math.max(0, validateNumeric(val)),
};
