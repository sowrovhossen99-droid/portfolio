const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const whatsappBtn = document.getElementById('whatsappBtn');

if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    const text = message
      ? `Hi Sourav, I'm ${name || 'a visitor'}${email ? ` (${email})` : ''}.\n\n${message}`
      : `Hi Sourav, I visited your portfolio and would like to connect!`;

    const url = `https://wa.me/8801755101237?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    formStatus.textContent = 'Sending message...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok && result.success) {
        formStatus.textContent = 'Thanks! Your message has been sent.';
        contactForm.reset();
      } else {
        formStatus.textContent = result.message || 'Something went wrong. Please try again.';
      }
    } catch (error) {
      formStatus.textContent = 'Network error. Please check your connection and try again.';
    }
  });
}
