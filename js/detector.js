/**
 * Aho-Corasick 多模式匹配引擎
 * 纯函数模块，不依赖 DOM / 浏览器 API
 */
const Detector = (() => {
  function createNode() {
    return { children: {}, fail: null, output: [] };
  }

  function buildAutomaton(words) {
    const root = createNode();
    for (const w of words) {
      let node = root;
      for (const ch of w.word) {
        if (!node.children[ch]) node.children[ch] = createNode();
        node = node.children[ch];
      }
      node.output.push(w);
    }
    const queue = [];
    for (const [ch, child] of Object.entries(root.children)) {
      child.fail = root;
      queue.push(child);
    }
    while (queue.length) {
      const current = queue.shift();
      for (const [ch, child] of Object.entries(current.children)) {
        queue.push(child);
        let f = current.fail;
        while (f !== null && !(ch in f.children)) f = f.fail;
        if (f === null) {
          child.fail = root;
        } else {
          child.fail = f.children[ch];
          child.output = child.output.concat(child.fail.output);
        }
      }
    }
    return root;
  }

  function scan(text, automaton) {
    const results = [];
    let node = automaton;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      while (node !== null && !(ch in node.children)) node = node.fail;
      if (node === null) { node = automaton; continue; }
      node = node.children[ch];
      for (const w of node.output) {
        results.push({
          word: w.word,
          id: w.id,
          startIndex: i - w.word.length + 1,
          endIndex: i + 1,
          level: w.level,
          category: w.category,
          categoryLabel: w.categoryLabel,
          suggestion: w.suggestion,
          description: w.description,
          reference: w.reference || '',
        });
      }
    }
    results.sort((a, b) => a.startIndex - b.startIndex || b.word.length - a.word.length);
    return results;
  }

  function dedupeOverlaps(matches) {
    if (matches.length === 0) return [];
    const kept = [matches[0]];
    for (let i = 1; i < matches.length; i++) {
      const last = kept[kept.length - 1];
      if (matches[i].startIndex >= last.endIndex) {
        kept.push(matches[i]);
      } else if (matches[i].word.length > last.word.length) {
        kept[kept.length - 1] = matches[i];
      }
    }
    return kept;
  }

  let automaton = null;
  let currentHash = '';

  function load(words) {
    const hash = JSON.stringify(words);
    if (hash === currentHash && automaton) return;
    automaton = buildAutomaton(words);
    currentHash = hash;
  }

  function check(text, words) {
    if (!text || !words || words.length === 0) return [];
    load(words);
    const raw = scan(text, automaton);
    return dedupeOverlaps(raw);
  }

  return { load, check };
})();
