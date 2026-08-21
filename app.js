const data = window.REVIEW_DATA;
const cardsRoot = document.querySelector("#cards");
const searchInput = document.querySelector("#search");
const changeFilter = document.querySelector("#change-filter");
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty");

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

document.querySelector("#summary").innerHTML = [
  [data.meta.sampleCount, "角色"],
  [data.meta.additionCount, "建议新增"],
  [data.meta.removalCount, "建议删除"],
].map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
document.querySelector("#generated-at").textContent = data.meta.generatedAt;

function suggestionTemplate(item, type) {
  return `
    <div class="suggestion suggestion--${type}">
      <div class="suggestion__line">
        <strong>${type === "add" ? "+" : "−"} ${escapeHtml(item.name)}</strong>
        <span class="score">${item.confidence}</span>
      </div>
      <p>${escapeHtml(item.reason)}</p>
    </div>
  `;
}

function cardTemplate(character) {
  const additions = character.additions.length
    ? character.additions.map((item) => suggestionTemplate(item, "add")).join("")
    : '<span class="muted">无</span>';
  const removals = character.removals.length
    ? character.removals.map((item) => suggestionTemplate(item, "remove")).join("")
    : '<span class="muted">无</span>';
  const originalTags = character.originalTags.length
    ? character.originalTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")
    : '<em>无已启用 Tag</em>';

  return `
    <article class="card">
      <div class="image-wrap">
        <img src="${escapeHtml(character.image)}" alt="${escapeHtml(character.name)} 的角色图片" loading="lazy" referrerpolicy="no-referrer" />
        <span class="index">${String(character.index).padStart(2, "0")}</span>
        <span class="rating">${character.nsfw ? "成人向" : "安全向"}</span>
      </div>
      <div class="card__content">
        <h2>${escapeHtml(character.name)}</h2>
        <p class="intro original-copy">${escapeHtml(character.intro)}</p>

        <div class="changes">
          <section>
            <h3>建议新增 <span>${character.additions.length}</span></h3>
            <div class="suggestion-list">${additions}</div>
          </section>
          <section>
            <h3>建议删除 <span>${character.removals.length}</span></h3>
            <div class="suggestion-list">${removals}</div>
          </section>
        </div>

        <div class="original-tags">
          <h3>当前已启用 Tag</h3>
          <div>${originalTags}</div>
        </div>

        <details>
          <summary>查看开场白</summary>
          <p class="greeting original-copy">${escapeHtml(character.greeting)}</p>
        </details>
      </div>
    </article>
  `;
}

function matches(character) {
  const query = searchInput.value.trim().toLocaleLowerCase("zh-CN");
  const haystack = [
    character.name,
    ...character.originalTags,
    ...character.additions.map((item) => item.name),
    ...character.removals.map((item) => item.name),
  ].join(" ").toLocaleLowerCase("zh-CN");
  if (query && !haystack.includes(query)) return false;

  const hasAdd = character.additions.length > 0;
  const hasRemove = character.removals.length > 0;
  if (changeFilter.value === "changed" && !hasAdd && !hasRemove) return false;
  if (changeFilter.value === "add" && !hasAdd) return false;
  if (changeFilter.value === "remove" && !hasRemove) return false;
  if (changeFilter.value === "none" && (hasAdd || hasRemove)) return false;
  return true;
}

function render() {
  const visible = data.characters.filter(matches);
  cardsRoot.innerHTML = visible.map(cardTemplate).join("");
  visibleCount.textContent = `${visible.length} / ${data.characters.length}`;
  emptyState.hidden = visible.length > 0;
}

[searchInput, changeFilter].forEach((control) => control.addEventListener("input", render));
render();
