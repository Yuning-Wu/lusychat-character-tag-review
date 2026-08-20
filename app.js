const data = window.REVIEW_DATA;
const cardsRoot = document.querySelector("#cards");
const searchInput = document.querySelector("#search");
const resultFilter = document.querySelector("#result-filter");
const tagFilter = document.querySelector("#tag-filter");
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty");

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const statItems = [
  [data.meta.sampleCount, "抽樣角色"],
  [data.meta.suggestionCount, "新增建議"],
  [data.meta.highConfidenceCount, "90+ 高置信"],
  [data.meta.noSuggestionCount, "本輪無建議"],
];
document.querySelector("#stats").innerHTML = statItems.map(([value, label]) => `
  <div class="stat"><strong>${value}</strong><span>${label}</span></div>
`).join("");
document.querySelector("#generated-at").textContent = `產生於 ${data.meta.generatedAt}（上海時間）`;

const allAddedTags = [...new Set(data.characters.flatMap((item) => item.suggestions.map((tag) => tag.name)))].sort((a, b) => a.localeCompare(b, "zh-Hant"));
tagFilter.insertAdjacentHTML("beforeend", allAddedTags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`).join(""));

function cardTemplate(character) {
  const suggestions = character.suggestions.length
    ? character.suggestions.map((tag) => `
        <div class="suggestion ${tag.confidence >= 90 ? "suggestion--high" : ""}">
          <div class="suggestion__top">
            <span class="suggestion__name">＋ ${escapeHtml(tag.name)}</span>
            <span class="confidence">${tag.confidence}</span>
            ${tag.temporarilyDisabled ? '<span class="disabled-badge">暫未啟用</span>' : ""}
          </div>
          <p>${escapeHtml(tag.reason)}</p>
        </div>
      `).join("")
    : '<div class="no-suggestion">本輪沒有足夠明確的新增 Tag</div>';

  const originalTags = character.originalTags.length
    ? character.originalTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")
    : '<em>尚無原 Tag</em>';

  return `
    <article class="card" data-index="${character.index}">
      <div class="portrait-wrap">
        <img class="portrait" src="${escapeHtml(character.image)}" alt="${escapeHtml(character.name)} 的角色圖片" loading="lazy" referrerpolicy="no-referrer" />
        <span class="sequence">${String(character.index).padStart(2, "0")}</span>
        <span class="rating ${character.nsfw ? "rating--nsfw" : ""}">${character.nsfw ? "成人向" : "安全向"}</span>
      </div>
      <div class="card__body">
        <h2>${escapeHtml(character.name)}</h2>
        <section class="content-block">
          <h3>簡介</h3>
          <p class="copy">${escapeHtml(character.intro)}</p>
        </section>
        <section class="added-block">
          <div class="added-block__title"><h3>本次建議新增</h3><span>${character.suggestions.length} 個</span></div>
          <div class="suggestions">${suggestions}</div>
        </section>
        <section class="original-block">
          <h3>原有 Tag <span>${character.originalTags.length}</span></h3>
          <div class="original-tags">${originalTags}</div>
        </section>
        <details>
          <summary>查看開場白</summary>
          <p class="copy greeting">${escapeHtml(character.greeting)}</p>
        </details>
      </div>
    </article>
  `;
}

function matches(character) {
  const query = searchInput.value.trim().toLocaleLowerCase("zh-Hant");
  const haystack = [character.name, ...character.originalTags, ...character.suggestions.map((tag) => tag.name)].join(" ").toLocaleLowerCase("zh-Hant");
  if (query && !haystack.includes(query)) return false;
  if (tagFilter.value !== "all" && !character.suggestions.some((tag) => tag.name === tagFilter.value)) return false;
  if (resultFilter.value === "suggested" && !character.suggestions.length) return false;
  if (resultFilter.value === "high" && !character.suggestions.some((tag) => tag.confidence >= 90)) return false;
  if (resultFilter.value === "none" && character.suggestions.length) return false;
  return true;
}

function render() {
  const visible = data.characters.filter(matches);
  cardsRoot.innerHTML = visible.map(cardTemplate).join("");
  visibleCount.textContent = `顯示 ${visible.length} / ${data.characters.length}`;
  emptyState.hidden = visible.length > 0;
}

[searchInput, resultFilter, tagFilter].forEach((control) => control.addEventListener("input", render));
render();
