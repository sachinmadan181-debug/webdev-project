// script.js - StorySmith generator
// Author: ChatGPT (example)
// Usage: included from index.html; no external libs required.

(() => {
  // Elements
  const topicEl = document.getElementById('topic');
  const genreEl = document.getElementById('genre');
  const lengthEl = document.getElementById('length');
  const generateBtn = document.getElementById('generate');
  const surpriseBtn = document.getElementById('surprise');
  const clearBtn = document.getElementById('clear');
  const storyEl = document.getElementById('story');
  const metaText = document.getElementById('metaText');
  const speedEl = document.getElementById('speed');
  const downloadBtn = document.getElementById('download');
  const editToggle = document.getElementById('editToggle');
  const regenerateBtn = document.getElementById('regenerate');

  let lastInputs = null;
  let typingTimer = null;

  // Small collections of templates / phrases per genre
  const genreBeats = {
    'Adventure': {
      tone: "bright, kinetic",
      settings: ["a sun-bleached port", "an uncharted island", "a snow-swept ridge", "a bustling market on the edge of the desert"],
      hooks: [
        "They only needed one thing: courage.",
        "No map could show what they were about to find.",
        "The wind carried a secret and a name."
      ],
      conflicts: ["an unexpected betrayal", "a roaring storm", "a collapsing bridge", "a rival treasure seeker"],
      style: "action-forward, brisk sentences"
    },
    'Fantasy': {
      tone: "mystical, wonder",
      settings: ["a city of glass towers", "a woodland where the trees whisper", "a cavern lit by mushrooms", "a ruined castle"],
      hooks: ["A legend woke when the moon spilled silver.", "Not all magic asks permission.", "A child kept an impossible key."],
      conflicts: ["a forgotten curse", "a guardian spirit", "a power-hungry noble", "a riddle-locked gate"],
      style: "lush imagery, slightly lyrical"
    },
    'Science Fiction': {
      tone: "curious, speculative",
      settings: ["a station orbiting a blue gas giant", "a city of humming neon", "a laboratory with humming machines", "a desert of glass shards"],
      hooks: ["The machine learned one new word: home.", "They had only forty hours before reboot.", "A message arrived from a future no one remembered."],
      conflicts: ["a failing AI", "corporate interference", "a moral experiment", "a time slip"],
      style: "precise imagery, idea-driven"
    },
    'Horror': {
      tone: "tense, uneasy",
      settings: ["an abandoned hospital", "a farmhouse in fog", "a subway at midnight", "a motel with buzzing neon"],
      hooks: ["It stared politely and waited.", "The house had no address but it had a memory.", "The clock struck thirteen and the lights answered."],
      conflicts: ["an unseen watcher", "a door that won't stay closed", "a whisper behind a wall", "a reflection that doesn't match"],
      style: "short sentences, dread and silence"
    },
    'Romance': {
      tone: "warm, intimate",
      settings: ["a rain-soaked café", "a rooftop garden", "a quiet library", "a ferry at sunset"],
      hooks: ["They found each other between two overdue books.", "The bouquet hadn't been meant for them.", "A wrong number changed everything."],
      conflicts: ["a misunderstanding", "a timed departure", "a past love returning", "an unspoken fear"],
      style: "character-focused, emotive"
    },
    'Mystery': {
      tone: "curious, investigative",
      settings: ["a foggy harbor", "a locked study", "a sleepy town", "a gallery at closing time"],
      hooks: ["The letter had no signature but plenty of threats.", "One painting was gone and no one noticed.", "A clock kept time with a lie."],
      conflicts: ["a hidden motive", "fabricated alibis", "missing evidence", "an unreliable witness"],
      style: "clues, twists, methodical pacing"
    },
    'Comedy': {
      tone: "playful, cheeky",
      settings: ["a chaotic office", "a family wedding", "a small-town festival", "a mismatched roommate apartment"],
      hooks: ["They learned the hard way that glitter never disappears.", "He tried to look wise and tripped.", "The cat was the only competent one."],
      conflicts: ["embarrassing lies", "a chain of misunderstandings", "an improbable situation", "slapstick mishaps"],
      style: "quick beats, humorous observations"
    },
    'Drama': {
      tone: "intense, character-driven",
      settings: ["a hospital corridor", "a cramped apartment", "an old courtroom", "a faded hometown café"],
      hooks: ["A single phone call rearranged every plan.", "They had been keeping the same secret for years.", "The photograph changed hands and futures."],
      conflicts: ["family secrets", "moral reckonings", "financial pressures", "long-held resentments"],
      style: "emotional beats, internal conflict"
    }
  };

  // Helper utils
  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function wordsToCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  // Build a story from scratch with simple templating
  function buildStory({topic = "an ordinary thing", genre = "Adventure", targetWords = 500}) {
    const beats = genreBeats[genre] || genreBeats['Adventure'];
    const title = `${genre} — ${capitalizeFirst(topic)}`;

    // Build structural beats depending on length
    const paragraphs = [];
    const opening = [
      rand(beats.hooks),
      `It began with ${articleFor(topic)} ${topic}.`,
      `No one expected ${topic} to change anything — until it did.`
    ];

    paragraphs.push(opening.join(' '));

    // Middle: introduce setting, character, inciting incident
    const chars = [
      `There was ${aPerson()}. They kept one small thing hidden from everyone.`,
      `A stranger arrived with a map and one polite lie.`,
      `Someone in town knew too much but said nothing.`
    ];
    paragraphs.push(`${rand(beats.settings)} set the scene. ${rand(chars)} The trouble began when ${rand(beats.conflicts)}.`);

    // Build a few beats until targetWords approx reached
    let running = paragraphs.join('\n\n');
    while (wordsToCount(running) < targetWords * 0.95) {
      // choose a paragraph style: escalation, character reflection, twist
      const choice = Math.random();
      if (choice < 0.4) {
        // escalation / action
        paragraphs.push(actionParagraph(topic, beats));
      } else if (choice < 0.7) {
        // reflection / character
        paragraphs.push(reflectionParagraph(topic, beats));
      } else {
        // twist / reveal set-up
        paragraphs.push(twistParagraph(topic, beats));
      }
      running = paragraphs.join('\n\n');
      // safety cap
      if (paragraphs.length > 12) break;
    }

    // Climax + resolution
    paragraphs.push(climaxParagraph(topic, beats));
    paragraphs.push(resolutionParagraph(topic, beats));

    // Compose final story
    let story = `${title}\n\n${paragraphs.join('\n\n')}`;
    // Trim to approx targetWords by removing last sentences if necessary
    story = trimToWordTarget(story, targetWords);
    return story;
  }

  // sentence building helpers
  function actionParagraph(topic, beats) {
    const verbs = ["raced", "charged", "slipped", "climbed", "fled", "dug", "negotiated", "argued"];
    const sentences = [
      `Action followed: someone ${rand(verbs)} toward the place where ${articleFor(topic)} ${topic} was kept.`,
      `For a long, breathless moment everything relied on a single, risky choice.`,
      `Noise and movement rearranged the plan; only grit remained.`,
      `A small misstep turned into an urgency none of them expected.`
    ];
    return rand(sentences);
  }

  function reflectionParagraph(topic, beats) {
    const intros = [
      `They thought about why ${articleFor(topic)} ${topic} had mattered at all.`,
      `At night the memory of ${topic} grew larger and stranger.`,
      `Some truths do not announce themselves; they collect in the quiet.`
    ];
    const closers = [
      `It felt like a lesson, but a private one.`,
      `No one could say they had not tried.`,
      `What remained was complicated and oddly tender.`
    ];
    return `${rand(intros)} ${rand(closers)}`;
  }

  function twistParagraph(topic, beats) {
    const twists = [
      `A detail everyone missed turned out to be the hinge.`,
      `Someone who had been silent finally explained why.`,
      `The thing they sought was already changing hands.`,
      `A secret note shifted the entire direction of the hunt.`
    ];
    return `${rand(twists)} It made the earlier choices look like practice.`;
  }

  function climaxParagraph(topic, beats) {
    const climaxes = [
      `At the critical hour they had to decide whether to keep ${articleFor(topic)} ${topic} or to let it go for the greater good.`,
      `Everything collapsed into a single room, a single breath, and a single choice.`,
      `The night answered with a sound like relief and like rupture at once.`
    ];
    return rand(climaxes);
  }

  function resolutionParagraph(topic, beats) {
    const closes = [
      `When morning came there were no neat endings, only fewer questions and a strange, steady hope.`,
      `They learned the truth about themselves more than they learned the truth about ${topic}.`,
      `Some things remained a mystery, but they carried what they learned forward anyway.`
    ];
    return rand(closes);
  }

  // small helpers for articles/names
  function articleFor(noun) {
    const first = noun.trim().charAt(0).toLowerCase();
    if ("aeiou".includes(first)) return "an";
    return "a";
  }

  function capitalizeFirst(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function aPerson() {
    const roles = ["a courier", "an old teacher", "a mechanic", "an anxious apprentice", "a retired detective", "a child with a fierce laugh"];
    return rand(roles);
  }

  // trims the story text to roughly target words by removing sentences from the end
  function trimToWordTarget(text, targetWords) {
    let words = text.trim().split(/\s+/);
    if (words.length <= targetWords) return text;
    // attempt to keep sentences until we exceed
    let sentences = text.split(/(?<=[.?!])\s+/);
    let out = "";
    for (let i = 0; i < sentences.length; i++) {
      const candidate = (out + " " + sentences[i]).trim();
      if (candidate.split(/\s+/).length > targetWords) break;
      out = candidate;
    }
    // if can't reach, just slice words
    if (!out) {
      out = words.slice(0, targetWords).join(' ') + "…";
    }
    return out;
  }

  // decide target words by length selection
  function wordsForLength(lenKey) {
    if (lenKey === 'short') return 220 + Math.floor(Math.random() * 60);
    if (lenKey === 'long') return 900 + Math.floor(Math.random() * 240);
    return 520 + Math.floor(Math.random() * 180); // medium
  }

  // UI: typing animation
  function typeTextInto(el, text, speed) {
    // clear prior
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
    el.innerText = "";
    let idx = 0;
    const delay = Math.max(0, 80 - speed); // speed slider reversed: higher speed -> shorter delay
    typingTimer = setInterval(() => {
      idx++;
      el.innerText = text.slice(0, idx);
      el.scrollTop = el.scrollHeight;
      if (idx >= text.length) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
    }, delay);
  }

  // Download helper
  function downloadText(filename, text) {
    const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // revoke after a short while
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  // Generate handler
  function generate(shouldShowTyping = true) {
    const topic = topicEl.value.trim() || "an ordinary object";
    const genre = genreEl.value;
    const lenKey = lengthEl.value;
    const wordTarget = wordsForLength(lenKey);

    lastInputs = {topic, genre, lenKey, wordTarget};

    metaText.innerText = `Topic: ${topic} · Genre: ${genre} · Target ≈ ${wordTarget} words`;

    const story = buildStory({topic, genre, targetWords: wordTarget});

    // show with typing
    const speed = parseInt(speedEl.value, 10) || 18;
    storyEl.contentEditable = false;
    if (shouldShowTyping) {
      typeTextInto(storyEl, story, speed);
    } else {
      storyEl.innerText = story;
    }
  }

  // Surprise Me helper
  function surprise() {
    const samples = [
      "a broken compass", "a stray violin", "the last key", "a postcard with no stamp",
      "an old photograph", "a pocket watch that runs backwards", "a blue kite", "a lost map"
    ];
    topicEl.value = rand(samples);
    genreEl.value = rand(Object.keys(genreBeats));
    lengthEl.value = rand(['short','medium','long']);
    generate(true);
  }

  // editing toggle
  let editing = false;
  function toggleEdit() {
    editing = !editing;
    storyEl.contentEditable = editing;
    editToggle.innerText = editing ? "Lock edits" : "Edit Story";
    if (!editing) {
      // lock and update meta about length
      const w = wordsToCount(storyEl.innerText || "");
      metaText.innerText += ` · Saved length: ${w} words`;
    }
    storyEl.focus();
  }

  // regeneration (same inputs)
  function regenerateSame() {
    if (!lastInputs) return generate(true);
    const {topic, genre, wordTarget} = lastInputs;
    const story = buildStory({topic, genre, targetWords: wordTarget});
    typeTextInto(storyEl, story, parseInt(speedEl.value, 10) || 18);
  }

  // wire up events
  generateBtn.addEventListener('click', () => generate(true));
  surpriseBtn.addEventListener('click', () => surprise());
  clearBtn.addEventListener('click', () => {
    topicEl.value = '';
    storyEl.innerText = '';
    metaText.innerText = '';
  });
  downloadBtn.addEventListener('click', () => {
    const title = (topicEl.value.trim() || "story").replace(/\s+/g, '_').toLowerCase();
    const content = storyEl.innerText.trim();
    if (!content) {
      alert('No story to download. Generate one first.');
      return;
    }
    downloadText(`${title}.txt`, content);
  });
  editToggle.addEventListener('click', toggleEdit);
  regenerateBtn.addEventListener('click', regenerateSame);

  // small nicety: press Enter on topic to generate
  topicEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generate(true);
    }
  });

  // initial sample story
  setTimeout(() => {
    topicEl.value = "a pocket watch that runs backwards";
    genreEl.value = "Mystery";
    generate(false);
  }, 120);

})();
