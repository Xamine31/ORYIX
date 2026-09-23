# ORYIX — sécurité des paiements Stripe sur GitHub Pages

Ce site est **statique**. La configuration fournie utilise des **Stripe Payment Links** : le client quitte ORYIX pour une page de paiement hébergée par Stripe.

## Ce qui est sûr à publier

Dans `payment-config.js`, tu peux publier uniquement des liens de ce type :

```text
https://buy.stripe.com/...
```

Ces URLs sont destinées à être publiques.

## Ce qu'il ne faut jamais publier

Ne mets jamais dans GitHub Pages ou dans ton dépôt :

- une clé Stripe commençant par `sk_live_...` ;
- une clé Stripe commençant par `sk_test_...` ;
- un secret de webhook ;
- un mot de passe ;
- un fichier privé d'e-book si tu veux le réserver aux acheteurs.

Tout code JavaScript d'un site GitHub Pages est visible par les visiteurs.

## Configuration

1. Crée un produit et un prix dans ton tableau de bord Stripe.
2. Crée un **Payment Link** pour chaque e-book.
3. Copie chaque URL publique `https://buy.stripe.com/...`.
4. Ouvre `payment-config.js` et remplis :

```js
links: {
  discipline: 'https://buy.stripe.com/...',
  mentalite: 'https://buy.stripe.com/...',
  confiance: 'https://buy.stripe.com/...',
  silence: 'https://buy.stripe.com/...',
  packComplet: 'https://buy.stripe.com/...'
}
```

5. Commence par des liens de test, vérifie le parcours, puis remplace-les par tes liens réels lorsque ton compte est prêt.

## Panier

Sans serveur, un site GitHub Pages ne peut pas créer de façon sécurisée une session Stripe dynamique avec une combinaison arbitraire d'e-books.

Le site gère donc :

- un paiement direct par e-book ;
- un panier visuel ;
- un lien de pack complet optionnel si tu crées ce pack dans Stripe.

Pour un vrai panier dynamique avec plusieurs produits, ajoute plus tard un backend ou une fonction serveur qui crée la session Stripe côté serveur.

## Livraison des e-books

Ne mets pas les PDF payants directement dans le dépôt GitHub public. Un visiteur pourrait trouver l'URL sans payer.

Utilise plutôt :

- un outil d'envoi automatique après paiement ;
- un stockage privé avec lien temporaire ;
- ou un backend qui vérifie le paiement avant de délivrer le fichier.

La page `merci.html` est seulement une page de confirmation visuelle. Elle ne doit pas contenir de lien secret vers le PDF.

## Compte de paiement

Utilise le compte Stripe uniquement conformément aux conditions d'âge, d'identité et d'activité du prestataire. Ne contourne pas ses vérifications.
