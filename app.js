const FONT_CDN = "https://unpkg.com/figlet@1.8.0/fonts/";

const ANSI_CODES = {
  black: '\\033[30m',
  red: '\\033[31m',
  green: '\\033[32m',
  yellow: '\\033[33m',
  blue: '\\033[34m',
  magenta: '\\033[35m',
  cyan: '\\033[36m',
  white: '\\033[37m',
  reset: '\\033[0m',
};

// All figlet.js bundled font names
const ALL_FONTS = [
  "1Row", "3-D", "3D Diagonal", "3D-ASCII", "3x5", "4Max", "5 Line Oblique",
  "AMC 3 Line", "AMC 3 Liv1", "AMC AAA01", "AMC Neko", "AMC Razor", "AMC Razor2",
  "AMC Slash", "AMC Slider", "AMC Thin", "AMC Tubes", "AMC Untitled",
  "ANSI Regular", "ANSI Shadow", "ASCII New Roman", "Acrobatic", "Alligator", "Alligator2",
  "Alpha", "Arrows", "Avatar", "B1FF", "Banner", "Banner3", "Banner3-D", "Banner4",
  "Barbwire", "Basic", "Bear", "Bell", "Benjamin", "Big", "Big Chief", "Big Money-ne",
  "Big Money-nw", "Big Money-se", "Big Money-sw", "Bigfig", "Binary", "Block",
  "Blocks", "Bloody", "Bolger", "Braced", "Bright", "Broadway", "Broadway KB",
  "Bubble", "Bulbhead", "Caligraphy", "Caligraphy2", "Calvin S", "Cards",
  "Catwalk", "Chiseled", "Chunky", "Coinstak", "Cola", "Colossal", "Computer",
  "Contessa", "Contrast", "Cosmike", "Crawford", "Crawford2", "Crazy", "Cricket",
  "Cursive", "Cyberlarge", "Cybermedium", "Cybersmall", "Cygnet", "DANC4",
  "DOS Rebel", "DWhistled", "Dancing Font", "Decimal", "Def Leppard", "Delta Corps Priest 1",
  "Diamond", "Diet Cola", "Digital", "Doh", "Doom", "Dot Matrix", "Double", "Double Shorts",
  "Dr Pepper", "Efti Chess", "Efti Font", "Efti Italic", "Efti Piti", "Efti Robot",
  "Efti Wall", "Efti Water", "Electronic", "Elite", "Epic", "Fender", "Filter",
  "Fire Font-k", "Fire Font-s", "Flipped", "Flower Power", "Four Tops", "Fraktur",
  "Fun Face", "Fun Faces", "Fuzzy", "Georgi16", "Georgia11", "Ghost", "Ghoulish",
  "Glenyn", "Goofy", "Gothic", "Graceful", "Gradient", "Graffiti", "Greek",
  "Heart Left", "Heart Right", "Henry 3D", "Hex", "Hollywood", "Horizontal Left",
  "Horizontal Right", "ICL-1900", "Impossible", "Invita", "Isometric1", "Isometric2",
  "Isometric3", "Isometric4", "Italic", "Ivrit", "JS Block Letters", "JS Bracket Letters",
  "JS Capital Curves", "JS Cursor", "JS Stick Letters", "Jacky", "Jazmine", "Jerusalem",
  "Katakana", "Kban", "Keyboard", "Knob", "Konto", "Konto Slant", "LCD", "Larry 3D",
  "Larry 3D 2", "Lean", "Letters", "Lil Devil", "Line Blocks", "Linux", "Lockergnome",
  "Madrid", "Marquee", "Maxfour", "Merlin1", "Merlin2", "Mike", "Mini", "Mirror",
  "Mnemonic", "Modular", "Morse", "Morse2", "Moscow", "Mshebrew210", "Muzzle",
  "NScript", "NT Greek", "NV Script", "Nancyj", "Nancyj-Fancy", "Nancyj-Improved",
  "Nancyj-Underlined", "Nipples", "O8", "OS2", "Octal", "Ogre", "Old Banner",
  "Patorjk's Cheese", "Patorjk-HeX", "Pawp", "Peaks", "Peaks Slant", "Pebbles",
  "Pepper", "Poison", "Puffy", "Puzzle", "Pyramid", "Rammstein", "Rectangles",
  "Red Phoenix", "Relief", "Relief2", "Reverse", "Roman", "Rot13", "Rotated",
  "Rounded", "Rowan Cap", "Rozzo", "Runic", "Runyc", "S Blood", "SL Script",
  "Santa Clara", "Script", "Serifcap", "Shadow", "Shimrod", "Short", "Slant",
  "Slant Relief", "Slide", "Small", "Small Caps", "Small Isometric1", "Small Keyboard",
  "Small Poison", "Small Script", "Small Shadow", "Small Slant", "Small Tengwar",
  "Soft", "Speed", "Spliff", "Stacey", "Stampate", "Stampatello", "Standard",
  "Star Strips", "Star Wars", "Stellar", "Stforek", "Stick Letters", "Stop",
  "Straight", "Stronger Than All", "Sub-Zero", "Swamp Land", "Swan", "Sweet",
  "THIS", "Tanja", "Tengwar", "Term", "Test1", "The Edge", "Thick", "Thin",
  "Thorned", "Three Point", "Ticks", "Ticks Slant", "Tiles", "Tinker-Toy",
  "Tombstone", "Train", "Trek", "Tsalagi", "Tubular", "Twisted", "Two Point",
  "USA Flag", "Univers", "Varsity", "Wavy", "Weird", "Wet Letter", "Whimsy",
  "Wow"
];

// Track loaded fonts
const loadedFonts = new Set();
// --- Font Loading ---

async function loadFont(fontName) {
  if (loadedFonts.has(fontName)) return;

  const fileName = fontName + ".flf";
  const url = FONT_CDN + encodeURIComponent(fileName);

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.text();
    figlet.parseFont(fontName, data);
    loadedFonts.add(fontName);
  } catch (e) {
    console.warn(`Failed to load font "${fontName}":`, e);
    throw e;
  }
}

// --- Rendering ---

async function renderText(text, fontName) {
  await loadFont(fontName);
  return new Promise((resolve, reject) => {
    figlet.text(text, { font: fontName }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function buildBanner(asciiArt, color) {
  let banner = asciiArt;

  if (color) {
    const code = ANSI_CODES[color];
    const reset = ANSI_CODES.reset;
    const lines = banner.split('\n');
    const colored = lines.map(line => {
      if (line.trim() === '') return line;
      return code + line + reset;
    });
    return { raw: colored.join('\n'), plain: banner };
  }

  return { raw: banner, plain: banner };
}

// --- Color Preview ---

function renderColorPreview(plain, color) {
  const container = document.getElementById('color-preview');
  const content = document.getElementById('color-preview-content');

  if (!color) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  content.innerHTML = '';

  const lines = plain.split('\n');
  lines.forEach(line => {
    const span = document.createElement('span');
    span.className = `ansi-${color}`;
    span.textContent = line;
    content.appendChild(span);
    content.appendChild(document.createTextNode('\n'));
  });
}

// --- UI Logic ---

function populateFonts() {
  const select = document.getElementById('font-select');
  ALL_FONTS.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === 'Standard') opt.selected = true;
    select.appendChild(opt);
  });
}

let updateTimer = null;

function scheduleUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(update, 150);
}

async function update() {
  const text = document.getElementById('text-input').value || 'Banner';
  const font = document.getElementById('font-select').value;
  const color = document.getElementById('color-select').value;
  const size = document.getElementById('size-select').value;
  const preview = document.getElementById('preview');
  const colorPreview = document.getElementById('color-preview-content');

  preview.style.fontSize = size;
  colorPreview.style.fontSize = size;

  // Show loading state if font not yet loaded
  if (!loadedFonts.has(font)) {
    preview.textContent = `Loading font "${font}"...`;
  }

  try {
    const asciiArt = await renderText(text, font);
    const { raw, plain } = buildBanner(asciiArt, color);

    preview.textContent = raw;
    renderColorPreview(plain, color);
    window._bannerRaw = raw;
  } catch (e) {
    preview.textContent = `Error loading font "${font}". Try another font.`;
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

async function copyToClipboard() {
  const text = window._bannerRaw || '';
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch {
    showToast('Failed to copy');
  }
}

function downloadBanner() {
  const text = window._bannerRaw || '';
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'banner.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded banner.txt');
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  populateFonts();

  document.getElementById('text-input').addEventListener('input', scheduleUpdate);
  document.getElementById('font-select').addEventListener('change', update);
  document.getElementById('color-select').addEventListener('change', update);
  document.getElementById('size-select').addEventListener('change', update);
  document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
  document.getElementById('download-btn').addEventListener('click', downloadBanner);

  // Preload Standard font, then render
  update();
});
