// Shared directory enhancement; data and navigation remain independent.
const page = document.querySelector('[data-directory]');
const isBelia = page.dataset.directory === 'belia';
const form = document.querySelector('#character-search');
const search = document.querySelector('#name-search');
const filters = document.querySelector('#directory-filters');
const grid = document.querySelector('#character-grid');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-result');
const dialog = document.querySelector('#character-modal');
const content = document.querySelector('#modal-content');
const closeButton = document.querySelector('#modal-close');
const normalize = value => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase();
const array = value => Array.isArray(value) ? value : value ? [value] : [];
const regions = person => array(person.continents?.length ? person.continents : person.continent);
const summary = person => person.summary || person.shortDescription || '';
const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const portrait = person => {
  const img = el('img', undefined, 'character-portrait');
  img.alt = person.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.src = person.image;
  return img;
};
let people = [], trigger = null, previousOverflow = '', activeId = null;
const selections = [];
function addFilter(label, key, values, display = value => value) {
  const wrapper = el('label', label);
  const select = el('select');
  select.id = 'filter-' + key;
  select.name = key;
  wrapper.htmlFor = select.id;
  const all = el('option', '전체'); all.value = ''; select.append(all);
  [...new Set(values.filter(value => value != null && value !== ''))].forEach(value => {
    const option = el('option', display(value)); option.value = value; select.append(option);
  });
  wrapper.append(select); filters.append(wrapper); selections.push({key, select});
}
function render() {
  const query = normalize(search.value);
  const matches = people.filter(person => {
    const haystack = normalize([person.name, ...array(person.aliases || person.alias), person.affiliation,
      person.role, person.department, person.position, person.origin, summary(person)].filter(Boolean).join(' '));
    return haystack.includes(query) && selections.every(({key, select}) => !select.value ||
      (key === 'continent' ? regions(person).includes(select.value) : String(person[key] ?? '') === select.value));
  });
  const fragment = document.createDocumentFragment();
  matches.forEach(person => {
    const card = el('article', undefined, 'character-card'); card.dataset.characterId = person.id;
    card.append(portrait(person));
    const body = el('div', undefined, 'character-card-body');
    body.append(el('h3', person.name));
    const metadata = isBelia ? [person.role === 'student' ? '학생' : '교직원', person.department,
      person.year ? person.year + '학년' : null, person.position, person.origin, person.race] :
      [regions(person).join(' · '), person.race, person.affiliation];
    body.append(el('p', metadata.filter(Boolean).join(' · '), 'character-meta'));
    if (summary(person)) body.append(el('p', summary(person), 'character-summary'));
    const button = el('button', '상세보기', 'button'); button.type = 'button';
    button.dataset.openCharacter = person.id;
    button.setAttribute('aria-label', person.name + ' 상세보기');
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => {
      trigger = button;
      if (location.hash !== '#' + encodeURIComponent(person.id)) {
        history.pushState({...history.state, characterModal: person.id}, '', '#' + encodeURIComponent(person.id));
      }
      show(person);
    });
    body.append(button); card.append(body); fragment.append(card);
  });
  grid.replaceChildren(fragment); count.textContent = people.length + '명 중 ' + matches.length + '명';
  empty.hidden = matches.length !== 0;
}
function show(person) {
  activeId = person.id;
  content.replaceChildren();
  content.append(portrait(person));
  const copy = el('div', undefined, 'modal-copy');
  const title = el('h2', person.name); title.id = 'modal-title'; copy.append(title);
  const facts = el('dl', undefined, 'modal-facts');
  const pairs = [['별칭', array(person.aliases || person.alias).join(' · ')],
    ['대륙', regions(person).join(' · ')], ['출신', person.origin], ['종족', person.race],
    ['소속', person.affiliation], ['구분', isBelia ? person.role === 'student' ? '학생' : '교직원' : null],
    ['역할', isBelia ? null : person.role], ['직책', person.position], ['학부', person.department],
    ['학년', person.year ? person.year + '학년' : null], ['특징', array(person.tags).join(' · ')]];
  pairs.forEach(([label, value]) => { if (value) facts.append(el('dt', label), el('dd', value)); });
  copy.append(facts);
  if (summary(person)) copy.append(el('p', summary(person)));
  if (person.details) copy.append(el('p', person.details));
  const relations = array(person.relations).filter(value => typeof value === 'string');
  if (relations.length) copy.append(el('p', relations.join('\n')));
  // Editorial source notes are not visitor-facing lore. Resolved migrations stay resolved.
  content.append(copy);
  if (!dialog.open) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.showModal();
  }
  dialog.scrollTop = 0; closeButton.focus();
}
function hide() {
  if (!dialog.open) return;
  dialog.close(); document.body.style.overflow = previousOverflow; activeId = null;
  if (trigger?.isConnected) trigger.focus(); else search.focus();
}
function syncHash() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { hide(); return; }
  const person = people.find(person => person.id === id);
  if (person) {
    if (!dialog.open) trigger = [...grid.querySelectorAll('button')].find(button => button.dataset.openCharacter === id) || null;
    if (activeId !== id || !dialog.open) show(person);
  } else hide();
}
function dismiss() {
  if (!dialog.open) return;
  const owned = history.state?.characterModal === activeId;
  hide();
  if (owned) history.back();
  else history.replaceState(history.state, '', location.pathname + location.search);
}
closeButton.addEventListener('click', dismiss);
dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
let backdropDown = false;
const outside = event => { const r = dialog.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
dialog.addEventListener('pointerdown', event => { backdropDown = outside(event); });
dialog.addEventListener('click', event => { if (backdropDown && outside(event)) dismiss(); backdropDown = false; });
// Keep Tab inside the dialog, including when its only control is Close.
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
    .filter(node => !node.disabled && node.getClientRects().length);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
});
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', render);
form.addEventListener('change', render);
form.addEventListener('reset', () => { search.value = ''; selections.forEach(({select}) => { select.value = ''; }); render(); });
window.addEventListener('popstate', syncHash);
window.addEventListener('hashchange', syncHash);
try {
  const data = isBelia ? await import('../data/belia-characters.js') : await import('../data/world-characters.js');
  people = (isBelia ? data.beliaCharacters : data.worldCharacters).filter(person => person?.id && person.name);
  if (isBelia) {
    addFilter('구분', 'role', people.map(person => person.role), value => value === 'student' ? '학생' : '교직원');
    addFilter('학부', 'department', people.map(person => person.department));
    addFilter('학년', 'year', people.map(person => person.year).filter(Boolean).sort(), value => value + '학년');
  } else addFilter('대륙', 'continent', people.flatMap(regions));
  render(); form.hidden = false; syncHash();
} catch (error) {
  count.textContent = '인물 정보를 불러오지 못했습니다. 페이지를 새로고침해 주세요.';
  console.error(error);
}
