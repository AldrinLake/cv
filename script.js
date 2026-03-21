(function () {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const title = document.getElementById('page-title');
  const langButtons = document.querySelectorAll('.lang-btn');

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderList(items) {
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }

  function renderEducation(educationList) {
    return educationList
      .map(
        (edu) => `
        <article class="edu-item">
          <h3>${escapeHtml(edu.degree)}</h3>
          <p>${escapeHtml(edu.school)}</p>
          <span>${escapeHtml(edu.period)}</span>
        </article>
      `
      )
      .join('');
  }

  function getContactIcon(type) {
    if (type === 'googleScholar') {
      return `
        <svg class="contact-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 3 2 9l10 6 10-6-10-6Z" fill="currentColor"></path>
          <path d="M6 12v4.5C6 18.99 8.69 21 12 21s6-2.01 6-4.5V12l-6 3.6L6 12Z" fill="currentColor"></path>
        </svg>
      `;
    }

    return `
      <svg class="contact-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.56v-2.1c-3.2.7-3.87-1.55-3.87-1.55-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.78 2.7 1.27 3.36.97.1-.76.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.28 1.2-3.08-.12-.3-.52-1.5.11-3.12 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.84 0c2.21-1.5 3.2-1.18 3.2-1.18.63 1.62.23 2.82.12 3.12.74.8 1.19 1.82 1.19 3.08 0 4.43-2.69 5.4-5.25 5.69.42.36.78 1.05.78 2.12v3.14c0 .31.2.67.79.56a11.53 11.53 0 0 0 7.84-10.92C23.5 5.65 18.35.5 12 .5Z" fill="currentColor"></path>
      </svg>
    `;
  }

  function renderPublications(publications, labels) {
    return publications
      .map(
        (pub) => `
        <article class="publication-item">
          <h3 class="pub-title">${escapeHtml(pub.title)}</h3>
          <p class="pub-authors">${escapeHtml(pub.authors)}</p>
          <p class="pub-venue">${escapeHtml(pub.venue)}</p>
          <a class="paper-btn" href="${escapeHtml(pub.url)}" target="_blank" rel="noopener">${escapeHtml(labels.paperButton)}</a>
        </article>
      `
      )
      .join('');
  }

  function render(data, lang) {
    const { left, right, labels, meta } = data;

    document.documentElement.lang = lang;
    document.title = `${left.name} – ${meta.pageTitle}`;
    title.textContent = meta.pageTitle;

    sidebar.innerHTML = `
      <section class="profile-card">
        <div class="avatar" aria-label="Avatar">${escapeHtml(left.avatar.text)}</div>
        <h2 class="name">${escapeHtml(left.name)}</h2>
        <p class="contact-line"><span>${escapeHtml(labels.email)}:</span> <a href="mailto:${escapeHtml(left.email)}">${escapeHtml(left.email)}</a></p>
        <p class="contact-line"><a class="contact-link" href="${escapeHtml(left.googleScholar.url)}" target="_blank" rel="noopener">${getContactIcon('googleScholar')}<span>${escapeHtml(left.googleScholar.label)}</span></a></p>
        <p class="contact-line"><a class="contact-link" href="${escapeHtml(left.github.url)}" target="_blank" rel="noopener">${getContactIcon('github')}<span>${escapeHtml(left.github.label)}</span></a></p>
      </section>

      <section>
        <h2>${escapeHtml(labels.education)}</h2>
        ${renderEducation(left.education)}
      </section>

      <section>
        <h2>${escapeHtml(labels.skills)}</h2>
        ${renderList(left.skills)}
      </section>

      <section>
        <h2>${escapeHtml(labels.interests)}</h2>
        ${renderList(left.interests)}
      </section>
    `;

    content.innerHTML = `
      <section>
        <h2>${escapeHtml(labels.about)}</h2>
        <p>${escapeHtml(right.about)}</p>
      </section>

      <section>
        <h2>${escapeHtml(labels.researchInterests)}</h2>
        ${renderList(right.researchInterests)}
      </section>

      <section>
        <h2>${escapeHtml(labels.news)}</h2>
        ${renderList(right.news)}
      </section>

      <section>
        <h2>${escapeHtml(labels.publications)}</h2>
        <div class="publication-list">${renderPublications(right.publications, labels)}</div>
      </section>

      <section>
        <h2>${escapeHtml(labels.honors)}</h2>
        ${renderList(right.honors)}
      </section>

      <section>
        <h2>${escapeHtml(labels.service)}</h2>
        <p>${escapeHtml(right.service)}</p>
      </section>
    `;
  }

  fetch('cv-data.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load CV data');
      }
      return response.json();
    })
    .then((data) => {
      window.__cvData = data;
      let currentLang = 'zh';

      function setLanguage(lang) {
        currentLang = lang;
        langButtons.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        render(data[currentLang], currentLang);
      }

      langButtons.forEach((btn) => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
      });

      setLanguage(currentLang);
    })
    .catch(() => {
      content.innerHTML = '<p>Unable to load CV data.</p>';
    });
})();
