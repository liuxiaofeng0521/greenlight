const UI = (() => {
  const textarea = document.getElementById('input-text');
  const detectBtn = document.getElementById('detect-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const resultArea = document.getElementById('result-area');
  const resultContent = document.getElementById('result-content');
  const counterText = document.getElementById('counter-text');
  const toastEl = document.getElementById('toast');
  const feedbackEl = document.getElementById('feedback');

  const MAX_FREE_PER_DAY = 3;
  let todayCount = 0;
  let todayDate = '';
  let currentWords = [];
  let currentMatches = [];

  function init() {
    loadCounters();
    textarea.addEventListener('input', onInput);
    detectBtn.addEventListener('click', onDetect);
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onDetect();
    });
    updateCounterUI();
  }

  function loadCounters() {
    try {
      const raw = localStorage.getItem('ldbj_count');
      if (raw) {
        const d = JSON.parse(raw);
        todayDate = d.date || '';
        todayCount = d.count || 0;
      }
    } catch (_) {}
    const today = new Date().toDateString();
    if (todayDate !== today) { todayDate = today; todayCount = 0; saveCounters(); }
  }

  function saveCounters() {
    try { localStorage.setItem('ldbj_count', JSON.stringify({ date: todayDate, count: todayCount })); } catch (_) {}
  }

  function updateCounterUI() {
    const remaining = Math.max(0, MAX_FREE_PER_DAY - todayCount);
    counterText.textContent = '已检测 ' + todayCount + ' 次 · 今日剩余 ' + remaining + ' 次';
    if (remaining <= 0) {
      detectBtn.disabled = true;
    } else if (remaining <= 1) {
      counterText.style.color = 'var(--color-warning)';
    } else {
      counterText.style.color = 'var(--color-text-muted)';
    }
  }

  function onInput() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(240, textarea.scrollHeight) + 'px';
  }

  function onDetect() {
    const text = textarea.value.trim();
    if (!text) { shakeTextarea(); showToast('请先粘贴文案再检测'); return; }
    if (todayCount >= MAX_FREE_PER_DAY) { showToast('今日免费次数已用完，明天再来吧'); return; }

    setLoading(true);
    resultArea.classList.remove('show');

    setTimeout(() => {
      currentMatches = Detector.check(text, currentWords);
      todayCount++;
      saveCounters();
      updateCounterUI();
      renderResults();
      setLoading(false);
      resultArea.classList.add('show');
      resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  }

  function setLoading(loading) {
    if (loading) {
      detectBtn.disabled = true;
      btnText.textContent = '检测中';
      btnSpinner.classList.add('show');
    } else {
      btnText.textContent = '一键检测';
      btnSpinner.classList.remove('show');
      updateCounterUI();
    }
  }

  function shakeTextarea() {
    textarea.style.borderColor = 'var(--color-error)';
    textarea.classList.add('shake');
    setTimeout(() => { textarea.style.borderColor = ''; textarea.classList.remove('shake'); }, 400);
  }

  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2000);
  }

  function renderResults() {
    if (currentMatches.length === 0) {
      resultContent.innerHTML =
        '<div class="result-pass"><div class="pass-icon">&#10003;</div><div class="pass-text">未发现违禁词，文案看起来很安全</div></div>';
      feedbackEl.style.display = 'none';
      return;
    }

    feedbackEl.style.display = 'flex';
    const highCount = currentMatches.filter(m => m.level === 'high').length;
    const mediumCount = currentMatches.filter(m => m.level === 'medium').length;
    const lowCount = currentMatches.filter(m => m.level === 'low').length;

    let html = '<div class="result-summary">检测到 <strong>' + currentMatches.length + '</strong> 处建议修改';
    if (highCount) html += ' <span class="badge badge-high">' + highCount + ' 高危</span>';
    if (mediumCount) html += ' <span class="badge badge-medium">' + mediumCount + ' 中危</span>';
    if (lowCount) html += ' <span class="badge badge-low">' + lowCount + ' 低危</span>';
    html += '</div>';

    const lines = textarea.value.split('\n');
    const lineStarts = [0];
    for (let i = 0; i < lines.length - 1; i++) {
      lineStarts.push(lineStarts[i] + lines[i].length + 1);
    }

    html += '<div class="result-list">';
    for (const m of currentMatches) {
      const lineNum = findLine(m.startIndex, lineStarts);
      const context = esc(textarea.value.slice(Math.max(0, m.startIndex - 10), m.startIndex)) +
        '<mark>' + esc(m.word) + '</mark>' +
        esc(textarea.value.slice(m.endIndex, Math.min(textarea.value.length, m.endIndex + 10)));

      html += '<div class="result-item result-item-' + m.level + '">';
      html += '<div class="result-item-header">';
      html += '<span class="line-num">第 ' + lineNum + ' 行</span>';
      html += '<span class="match-word">' + esc(m.word) + '</span>';
      html += '<span class="risk-badge risk-' + m.level + '">' + levelLabel(m.level) + '</span>';
      html += '<span class="category-tag">' + esc(m.categoryLabel) + '</span>';
      html += '</div>';
      html += '<div class="result-context">...' + context + '...</div>';
      html += '<div class="result-reason">' + esc(m.description) + '</div>';
      if (m.suggestion) {
        html += '<div class="result-suggestion">建议替换：<span class="sug-text">' + esc(m.suggestion) + '</span></div>';
      }
      html += '</div>';
    }
    html += '</div>';
    resultContent.innerHTML = html;
  }

  function findLine(charIndex, lineStarts) {
    for (let i = lineStarts.length - 1; i >= 0; i--) {
      if (charIndex >= lineStarts[i]) return i + 1;
    }
    return 1;
  }

  function levelLabel(level) {
    if (level === 'high') return '高危';
    if (level === 'medium') return '中危';
    return '低危';
  }

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadWordBank() {
    try {
      const res = await fetch('data/banned-words.json');
      const data = await res.json();
      currentWords = data.words || [];
      document.getElementById('word-version').textContent = data.meta ? data.meta.version : '-';
      document.getElementById('word-count').textContent = currentWords.length;
      return currentWords;
    } catch (err) {
      console.error('词库加载失败:', err);
      showToast('词库加载失败，请刷新页面重试');
      return [];
    }
  }

  return { init, loadWordBank };
})();

document.addEventListener('DOMContentLoaded', async () => {
  await UI.loadWordBank();
  UI.init();
});
