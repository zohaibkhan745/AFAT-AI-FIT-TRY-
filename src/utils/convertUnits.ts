export const cmToInches = (cm: number): string => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = (inches % 12).toFixed(1);
  return `${feet}ft ${remainingInches}in`;
};

export const convertValue = (value: number, toUnit: "cm" | "in"): string => {
  if (toUnit === "cm") return `${value.toFixed(1)} cm`;
  return cmToInches(value);
};
