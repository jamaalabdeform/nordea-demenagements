const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const formatEur = (n: number) => eur.format(n);
