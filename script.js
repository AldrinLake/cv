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
        <p class="contact-line"><a href="${escapeHtml(left.googleScholar.url)}" target="_blank" rel="noopener">${escapeHtml(left.googleScholar.label)}</a></p>
        <p class="contact-line"><a href="${escapeHtml(left.github.url)}" target="_blank" rel="noopener">${escapeHtml(left.github.label)}</a></p>
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
