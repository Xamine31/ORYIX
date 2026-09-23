/*
  ORYIX — configuration des paiements Stripe

  SECURITE :
  - Mets ici uniquement des URLs publiques Stripe Payment Link (https://buy.stripe.com/...).
  - Ne mets JAMAIS de clé secrète Stripe (sk_live_..., sk_test_...) dans ce fichier,
    dans GitHub Pages, ni dans aucun fichier JavaScript public.
  - Les informations bancaires sont saisies sur la page hébergée par Stripe.

  Création des liens : Stripe Dashboard > Payment links > New.
  Utilise des liens en mode test pendant tes essais, puis remplace-les par les liens live.
*/
window.ORYIX_PAYMENT_CONFIG = Object.freeze({
  currency: 'EUR',
  mode: 'test', // 'test' ou 'live' — indicatif uniquement
  links: Object.freeze({
    discipline: '',
    mentalite: '',
    confiance: '',
    silence: '',
    packComplet: ''
  })
});
