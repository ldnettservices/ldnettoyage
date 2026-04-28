// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => nav.classList.toggle('open'));

// Mobile dropdown
document.querySelectorAll('.has-dropdown').forEach(item => {
  item.querySelector('.nav__link').addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      item.classList.toggle('open');
    }
  });
});

document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    nav.classList.remove('open');
    const offset = document.getElementById('header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== FORM → N8N WEBHOOK =====
const WEBHOOK = 'https://n8n-formation.isao.io/webhook-test/cleanpro-lead-capture';

document.getElementById('devisForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btnText = document.getElementById('btnText');
  const btnLoading = document.getElementById('btnLoading');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  successEl.style.display = 'none';
  errorEl.style.display = 'none';

  if (!form.checkValidity()) { form.reportValidity(); return; }

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  document.getElementById('submitBtn').disabled = true;

  const payload = {
    prenom: form.prenom.value.trim(),
    nom: form.nom.value.trim(),
    nom_complet: `${form.prenom.value.trim()} ${form.nom.value.trim()}`,
    email: form.email.value.trim(),
    telephone: form.telephone.value.trim(),
    message: form.message.value.trim(),
    source: window.location.hostname || 'ldnettoyage',
    date: new Date().toISOString(),
  };

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      successEl.style.display = 'block';
      form.reset();
    } else {
      throw new Error(res.status);
    }
  } catch {
    errorEl.style.display = 'block';
  } finally {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    document.getElementById('submitBtn').disabled = false;
  }
});
