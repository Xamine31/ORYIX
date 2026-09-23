(() => {
  'use strict';

  const money = value => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);

  const PAYMENT_CONFIG = window.ORYIX_PAYMENT_CONFIG || { mode: 'test', links: {} };
  const PAYMENT_LINKS = PAYMENT_CONFIG.links || {};

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('visible'));

  const cart = [];
  const panel = document.querySelector('.cart-panel');
  const overlay = document.querySelector('.overlay');
  const count = document.querySelector('.cart-count');
  const itemsEl = document.querySelector('.cart-items');
  const emptyEl = document.querySelector('.cart-empty');
  const totalEl = document.querySelector('.cart-total');
  const checkout = document.querySelector('.checkout-button');
  const checkoutHelp = document.querySelector('.checkout-help');

  const isStripePaymentLink = url => /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_?=&-]+$/i.test(String(url || '').trim());

  function openCart() {
    panel?.classList.add('open');
    panel?.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    panel?.classList.remove('open');
    panel?.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function configuredLinkFor(id) {
    const url = PAYMENT_LINKS[id];
    return isStripePaymentLink(url) ? url.trim() : '';
  }

  function getCheckoutLink() {
    if (!cart.length) return '';

    const ids = [...new Set(cart.map(item => item.id))];

    // Un seul e-book : on utilise son Payment Link individuel.
    if (ids.length === 1 && cart.length === 1) {
      return configuredLinkFor(ids[0]);
    }

    // Le pack complet peut être vendu via un Payment Link Stripe prédéfini.
    const completePack = ['discipline', 'mentalite', 'confiance', 'silence'];
    const isCompletePack = cart.length === 4 && completePack.every(id => ids.includes(id));
    if (isCompletePack) {
      return configuredLinkFor('packComplet');
    }

    return '';
  }

  function renderCart() {
    if (!count || !itemsEl || !emptyEl || !totalEl || !checkout) return;

    count.textContent = String(cart.length);
    itemsEl.innerHTML = '';
    emptyEl.hidden = cart.length > 0;

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      const row = document.createElement('div');
      row.className = 'cart-item';

      const copy = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = item.name;
      const price = document.createElement('small');
      price.textContent = money(item.price);
      copy.append(title, price);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Retirer';
      remove.setAttribute('aria-label', `Retirer ${item.name}`);
      remove.addEventListener('click', () => {
        cart.splice(index, 1);
        renderCart();
      });

      row.append(copy, remove);
      itemsEl.appendChild(row);
    });

    totalEl.textContent = money(total);
    checkout.disabled = cart.length === 0;

    const ready = Boolean(getCheckoutLink());
    checkout.textContent = ready ? 'Payer avec Stripe' : 'Configurer / choisir le paiement';
    if (checkoutHelp) {
      checkoutHelp.textContent = ready
        ? 'Tu seras redirigé vers la page de paiement sécurisée hébergée par Stripe.'
        : 'Aucune donnée bancaire n’est collectée sur ce site. Ajoute tes Payment Links dans payment-config.js.';
    }
  }

  document.querySelectorAll('.add-cart').forEach(btn => btn.addEventListener('click', () => {
    const card = btn.closest('[data-product]');
    if (!card) return;

    const id = card.dataset.paymentId;
    const duplicate = cart.some(item => item.id === id);
    if (!duplicate) {
      cart.push({
        id,
        name: card.dataset.product,
        price: Number(card.dataset.price)
      });
    }
    renderCart();
    openCart();
  }));

  document.querySelectorAll('.buy-now').forEach(btn => btn.addEventListener('click', () => {
    const card = btn.closest('[data-product]');
    if (!card) return;
    const link = configuredLinkFor(card.dataset.paymentId);
    if (link) {
      window.location.assign(link);
      return;
    }
    showPaymentSetup(card.dataset.product);
  }));

  document.querySelector('.cart-button')?.addEventListener('click', openCart);
  document.querySelector('.close-cart')?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  checkout?.addEventListener('click', () => {
    if (!cart.length) return;
    const link = getCheckoutLink();
    if (link) {
      window.location.assign(link);
      return;
    }

    const uniqueIds = [...new Set(cart.map(item => item.id))];
    if (uniqueIds.length > 1) {
      showPaymentSetup('ce panier', 'GitHub Pages ne peut pas créer de panier Stripe dynamique sans backend. Utilise un Payment Link de pack prédéfini, ou achète les e-books individuellement.');
    } else {
      showPaymentSetup(cart[0]?.name || 'cet e-book');
    }
  });

  const paymentModal = document.querySelector('.payment-modal');
  const paymentModalTitle = document.querySelector('.payment-modal-title');
  const paymentModalText = document.querySelector('.payment-modal-text');

  function showPaymentSetup(productName, customText = '') {
    if (!paymentModal) return;
    if (paymentModalTitle) paymentModalTitle.textContent = `Paiement Stripe — ${productName}`;
    if (paymentModalText) {
      paymentModalText.textContent = customText || 'Le lien Stripe de ce produit n’est pas encore configuré. Ajoute uniquement ton URL publique buy.stripe.com dans payment-config.js — jamais de clé secrète.';
    }
    paymentModal.showModal();
  }

  document.querySelector('.payment-modal-close')?.addEventListener('click', () => paymentModal?.close());
  paymentModal?.addEventListener('click', e => {
    if (e.target === paymentModal) paymentModal.close();
  });

  const modal = document.querySelector('.preview-modal');
  document.querySelector('.preview-button')?.addEventListener('click', () => modal?.showModal());
  document.querySelector('.modal-close')?.addEventListener('click', () => modal?.close());
  modal?.addEventListener('click', e => {
    if (e.target === modal) modal.close();
  });

  const form = document.querySelector('.newsletter-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const msg = form.querySelector('.form-message');
    if (!input || !msg) return;
    if (!input.value || !input.checkValidity()) {
      msg.textContent = 'Entre une adresse e-mail valide.';
      input.focus();
      return;
    }
    msg.textContent = 'Merci ! Connecte ce formulaire à ton outil e-mail avant la mise en ligne.';
    form.reset();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  renderCart();
})();
