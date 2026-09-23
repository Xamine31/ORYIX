# ORYIX — site GitHub Pages + Stripe Payment Links

Site statique responsive (PC + mobile), sans framework, prêt pour GitHub Pages.

## Contenu

- `index.html` — page principale
- `styles.css` — design responsive
- `script.js` — menu, panier, achat, extrait et newsletter
- `payment-config.js` — **seul fichier à modifier pour les liens Stripe**
- `merci.html` — page de confirmation visuelle
- `SECURITE-PAIEMENTS.md` — guide de sécurité
- `assets/` — logo, illustrations et couvertures
- `404.html` — page 404 GitHub Pages
- pages légales modèles à personnaliser

## Tester en local

Tu peux ouvrir `index.html` directement. Pour un test plus réaliste :

```bash
python -m http.server 8000
```

Puis ouvre `http://localhost:8000`.

## Publier sur GitHub Pages

1. Crée un dépôt GitHub.
2. Envoie tous les fichiers de ce dossier à la racine.
3. Va dans **Settings > Pages**.
4. Choisis **Deploy from a branch**.
5. Sélectionne `main` puis `/ (root)`.
6. Enregistre.

## Configurer Stripe

Le site ne collecte jamais les cartes bancaires. Les boutons redirigent vers des pages Stripe hébergées.

Ouvre `payment-config.js` et remplace les champs vides :

```js
window.ORYIX_PAYMENT_CONFIG = Object.freeze({
  currency: 'EUR',
  mode: 'test',
  links: Object.freeze({
    discipline: 'https://buy.stripe.com/...',
    mentalite: 'https://buy.stripe.com/...',
    confiance: 'https://buy.stripe.com/...',
    silence: 'https://buy.stripe.com/...',
    packComplet: 'https://buy.stripe.com/...'
  })
});
```

Commence avec tes liens de test. Quand tout fonctionne, remplace-les par les liens live et passe `mode` à `live` si tu veux l'indiquer dans la configuration.

**Ne mets jamais une clé `sk_live_...`, `sk_test_...` ou un secret webhook dans un site GitHub Pages.**

Consulte `SECURITE-PAIEMENTS.md` pour les détails.

## Page de remerciement

Tu peux configurer Stripe pour rediriger l'acheteur vers :

```text
https://TON-UTILISATEUR.github.io/TON-DEPOT/merci.html
```

Cette page ne vérifie pas le paiement. N'y mets pas le PDF payant.

## Newsletter

Le formulaire reste en mode démo. Pour enregistrer les e-mails, connecte-le à un service prévu pour les sites statiques ou à ton propre backend.

## Important

Les pages légales sont des modèles. Complète-les avec les informations réelles de ton activité, tes modalités de livraison numérique et ta politique de remboursement avant la mise en ligne.

## Visuels des e-books

Les quatre couvertures sont incluses directement dans le projet :

- `assets/covers/discipline.svg`
- `assets/covers/mentalite.svg`
- `assets/covers/confiance.svg`
- `assets/covers/silence.svg`

Le site applique automatiquement un effet de livre 3D en CSS dans le hero et dans les cartes produits. Aucun service externe n'est nécessaire.

Pour remplacer une couverture plus tard, garde le même nom de fichier ou modifie le chemin dans `index.html`. Les proportions recommandées sont environ **2:3** (portrait).
