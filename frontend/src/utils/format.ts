export const formatNumberFr = (value: number): string => value.toLocaleString('fr-FR');

export const formatCredits = (value: number): string => `${formatNumberFr(value)} crédits`;

/** `YYYY-MM-DD` → `JJ/MM/AAAA`, sans dépendre du fuseau horaire du navigateur. */
export const formatDateFr = (isoDate: string): string => {
  const datePart = isoDate.split('T')[0] || '';
  const parts = datePart.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export const formatOrdinalFr = (value: number): string => (value === 1 ? '1er' : `${value}e`);
