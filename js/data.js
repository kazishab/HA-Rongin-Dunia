/* HA রঙিন পাঠশালা — কনটেন্ট ডেটা */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBnNumeral(n) {
  return String(n)
    .split("")
    .map((d) => BN_DIGITS[parseInt(d, 10)])
    .join("");
}

const EN_ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const EN_TEENS = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const EN_TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
function toEnglishNumber(n) {
  if (n === 100) return "One Hundred";
  if (n < 10) return EN_ONES[n];
  if (n < 20) return EN_TEENS[n - 10];
  const t = Math.floor(n / 10), o = n % 10;
  return EN_TENS[t] + (o ? "-" + EN_ONES[o] : "");
}

const VOWELS = [
  { char: "অ", word: "অজগর", emoji: "🐍", speak: "অজগর" },
  { char: "আ", word: "আম", emoji: "🥭", speak: "আম" },
  { char: "ই", word: "ইঁদুর", emoji: "🐭", speak: "ইঁদুর" },
  { char: "ঈ", word: "ঈগল", emoji: "🦅", speak: "ঈগল" },
  { char: "উ", word: "উট", emoji: "🐫", speak: "উট" },
  { char: "ঊ", word: "ঊর্ণনাভ", emoji: "🕷️", speak: "ঊর্ণনাভ, মাকড়সা" },
  { char: "ঋ", word: "ঋষি", emoji: "🧙", speak: "ঋষি" },
  { char: "এ", word: "একতারা", emoji: "🎻", speak: "একতারা" },
  { char: "ঐ", word: "ঐরাবত", emoji: "🐘", speak: "ঐরাবত, হাতি" },
  { char: "ও", word: "ওল", emoji: "🥔", speak: "ওল" },
  { char: "ঔ", word: "ঔষধ", emoji: "💊", speak: "ঔষধ" }
];

const CONSONANTS = [
  { char: "ক", word: "কলম", emoji: "✏️", speak: "কলম" },
  { char: "খ", word: "খরগোশ", emoji: "🐰", speak: "খরগোশ" },
  { char: "গ", word: "গরু", emoji: "🐄", speak: "গরু" },
  { char: "ঘ", word: "ঘড়ি", emoji: "⌚", speak: "ঘড়ি" },
  { char: "ঙ", word: "", emoji: "🔤", speak: "ঙ" },
  { char: "চ", word: "চাঁদ", emoji: "🌙", speak: "চাঁদ" },
  { char: "ছ", word: "ছাতা", emoji: "☂️", speak: "ছাতা" },
  { char: "জ", word: "জাহাজ", emoji: "🚢", speak: "জাহাজ" },
  { char: "ঝ", word: "ঝুড়ি", emoji: "🧺", speak: "ঝুড়ি" },
  { char: "ঞ", word: "", emoji: "🔤", speak: "ঞ" },
  { char: "ট", word: "টমেটো", emoji: "🍅", speak: "টমেটো" },
  { char: "ঠ", word: "ঠোঁট", emoji: "👄", speak: "ঠোঁট" },
  { char: "ড", word: "ডিম", emoji: "🥚", speak: "ডিম" },
  { char: "ঢ", word: "ঢোল", emoji: "🥁", speak: "ঢোল" },
  { char: "ণ", word: "", emoji: "🔤", speak: "ণ" },
  { char: "ত", word: "তরমুজ", emoji: "🍉", speak: "তরমুজ" },
  { char: "থ", word: "থালা", emoji: "🍽️", speak: "থালা" },
  { char: "দ", word: "দই", emoji: "🥣", speak: "দই" },
  { char: "ধ", word: "ধান", emoji: "🌾", speak: "ধান" },
  { char: "ন", word: "নৌকা", emoji: "⛵", speak: "নৌকা" },
  { char: "প", word: "পাখি", emoji: "🐦", speak: "পাখি" },
  { char: "ফ", word: "ফুল", emoji: "🌸", speak: "ফুল" },
  { char: "ব", word: "বল", emoji: "⚽", speak: "বল" },
  { char: "ভ", word: "ভাল্লুক", emoji: "🐻", speak: "ভাল্লুক" },
  { char: "ম", word: "মাছ", emoji: "🐟", speak: "মাছ" },
  { char: "য", word: "যাদুকর", emoji: "🧙‍♂️", speak: "যাদুকর" },
  { char: "র", word: "রং", emoji: "🎨", speak: "রং" },
  { char: "ল", word: "লাটিম", emoji: "🪀", speak: "লাটিম" },
  { char: "শ", word: "শসা", emoji: "🥒", speak: "শসা" },
  { char: "ষ", word: "ষাঁড়", emoji: "🐂", speak: "ষাঁড়" },
  { char: "স", word: "সাপ", emoji: "🐍", speak: "সাপ" },
  { char: "হ", word: "হাতি", emoji: "🐘", speak: "হাতি" },
  { char: "ড়", word: "", emoji: "🔤", speak: "ড়" },
  { char: "ঢ়", word: "", emoji: "🔤", speak: "ঢ়" },
  { char: "য়", word: "", emoji: "🔤", speak: "য়" },
  { char: "ৎ", word: "", emoji: "🔤", speak: "ৎ" },
  { char: "ং", word: "", emoji: "🔤", speak: "অনুস্বার" },
  { char: "ঃ", word: "", emoji: "🔤", speak: "বিসর্গ" },
  { char: "ঁ", word: "", emoji: "🔤", speak: "চন্দ্রবিন্দু" }
];

const ENGLISH_ALPHA = [
  { char: "A", word: "Apple", emoji: "🍎", speak: "Apple" },
  { char: "B", word: "Ball", emoji: "⚽", speak: "Ball" },
  { char: "C", word: "Cat", emoji: "🐱", speak: "Cat" },
  { char: "D", word: "Dog", emoji: "🐶", speak: "Dog" },
  { char: "E", word: "Elephant", emoji: "🐘", speak: "Elephant" },
  { char: "F", word: "Fish", emoji: "🐟", speak: "Fish" },
  { char: "G", word: "Grapes", emoji: "🍇", speak: "Grapes" },
  { char: "H", word: "Hat", emoji: "🎩", speak: "Hat" },
  { char: "I", word: "Ice Cream", emoji: "🍦", speak: "Ice Cream" },
  { char: "J", word: "Juice", emoji: "🧃", speak: "Juice" },
  { char: "K", word: "Kite", emoji: "🪁", speak: "Kite" },
  { char: "L", word: "Lion", emoji: "🦁", speak: "Lion" },
  { char: "M", word: "Moon", emoji: "🌙", speak: "Moon" },
  { char: "N", word: "Nest", emoji: "🪺", speak: "Nest" },
  { char: "O", word: "Orange", emoji: "🍊", speak: "Orange" },
  { char: "P", word: "Pineapple", emoji: "🍍", speak: "Pineapple" },
  { char: "Q", word: "Queen", emoji: "👸", speak: "Queen" },
  { char: "R", word: "Rabbit", emoji: "🐰", speak: "Rabbit" },
  { char: "S", word: "Sun", emoji: "☀️", speak: "Sun" },
  { char: "T", word: "Tiger", emoji: "🐯", speak: "Tiger" },
  { char: "U", word: "Umbrella", emoji: "☂️", speak: "Umbrella" },
  { char: "V", word: "Violin", emoji: "🎻", speak: "Violin" },
  { char: "W", word: "Watermelon", emoji: "🍉", speak: "Watermelon" },
  { char: "X", word: "Xylophone", emoji: "🎹", speak: "Xylophone" },
  { char: "Y", word: "Yoyo", emoji: "🪀", speak: "Yoyo" },
  { char: "Z", word: "Zebra", emoji: "🦓", speak: "Zebra" }
];
const FRUITS = [
  { char: "🥭", word: "আম", sub: "Mango", speak: "আম" },
  { char: "🍌", word: "কলা", sub: "Banana", speak: "কলা" },
  { char: "🍎", word: "লাল আপেল", sub: "Apple", speak: "লাল আপেল" },
  { char: "🍏", word: "সবুজ আপেল", sub: "Green Apple", speak: "সবুজ আপেল" },
  { char: "🍊", word: "কমলা", sub: "Orange", speak: "কমলা" },
  { char: "🍋", word: "লেবু", sub: "Lemon", speak: "লেবু" },
  { char: "🍇", word: "আঙুর", sub: "Grapes", speak: "আঙুর" },
  { char: "🍉", word: "তরমুজ", sub: "Watermelon", speak: "তরমুজ" },
  { char: "🍈", word: "বাঙ্গি", sub: "Melon", speak: "বাঙ্গি" },
  { char: "🍍", word: "আনারস", sub: "Pineapple", speak: "আনারস" },
  { char: "🍓", word: "স্ট্রবেরি", sub: "Strawberry", speak: "স্ট্রবেরি" },
  { char: "🫐", word: "ব্লুবেরি", sub: "Blueberries", speak: "ব্লুবেরি" },
  { char: "🍒", word: "চেরি", sub: "Cherries", speak: "চেরি" },
  { char: "🍑", word: "পীচ ফল", sub: "Peach", speak: "পীচ ফল" },
  { char: "🍐", word: "নাশপাতি", sub: "Pear", speak: "নাশপাতি" },
  { char: "🥥", word: "নারকেল", sub: "Coconut", speak: "নারকেল" },
  { char: "🥝", word: "কিউই", sub: "Kiwi", speak: "কিউই" },
  { char: "🥑", word: "এভোকাডো", sub: "Avocado", speak: "এভোকাডো" },
  { char: "🍅", word: "টমেটো", sub: "Tomato", speak: "টমেটো" },
  { char: "🫒", word: "জলপাই", sub: "Olive", speak: "জলপাই" }
];
const FLOWERS = [
  { char: "🌹", word: "গোলাপ", sub: "Rose", speak: "গোলাপ" },
  { char: "🌻", word: "সূর্যমুখী", sub: "Sunflower", speak: "সূর্যমুখী" },
  { char: "🌺", word: "জবা", sub: "Hibiscus", speak: "জবা" },
  { char: "🪷", word: "পদ্ম", sub: "Lotus", speak: "পদ্ম" },
  { char: "🌷", word: "টিউলিপ", sub: "Tulip", speak: "টিউলিপ" },
  { char: "🌼", word: "ডেইজি", sub: "Daisy", speak: "ডেইজি" },
  { char: "🌸", word: "চেরি ফুল", sub: "Cherry Blossom", speak: "চেরি ফুল" },
  { char: "🪻", word: "হায়াসিন্থ", sub: "Hyacinth", speak: "হায়াসিন্থ" },
  { char: "💐", word: "ফুলের তোড়া", sub: "Bouquet", speak: "ফুলের তোড়া" }
];
const ARABIC = [
  { char: "ا", word: "আলিফ", sub: "Alif", speak: "ا" },
  { char: "ب", word: "বা", sub: "Ba", speak: "ب" },
  { char: "ت", word: "তা", sub: "Ta", speak: "ت" },
  { char: "ث", word: "ছা", sub: "Tha", speak: "ث" },
  { char: "ج", word: "জিম", sub: "Jim", speak: "ج" },
  { char: "ح", word: "হা (ভারী)", sub: "Ha", speak: "ح" },
  { char: "خ", word: "খ", sub: "Kha", speak: "خ" },
  { char: "د", word: "দাল", sub: "Dal", speak: "د" },
  { char: "ذ", word: "যাল", sub: "Dhal", speak: "ذ" },
  { char: "ر", word: "রা", sub: "Ra", speak: "ر" },
  { char: "ز", word: "যা", sub: "Zay", speak: "ز" },
  { char: "س", word: "সিন", sub: "Sin", speak: "س" },
  { char: "ش", word: "শিন", sub: "Shin", speak: "ش" },
  { char: "ص", word: "সোয়াদ", sub: "Sad", speak: "ص" },
  { char: "ض", word: "দোয়াদ", sub: "Dad", speak: "ض" },
  { char: "ط", word: "তোয়া", sub: "Ta (heavy)", speak: "ط" },
  { char: "ظ", word: "যোয়া", sub: "Za (heavy)", speak: "ظ" },
  { char: "ع", word: "আইন", sub: "Ain", speak: "ع" },
  { char: "غ", word: "গাইন", sub: "Ghain", speak: "غ" },
  { char: "ف", word: "ফা", sub: "Fa", speak: "ف" },
  { char: "ق", word: "ক্বাফ", sub: "Qaf", speak: "ق" },
  { char: "ك", word: "কাফ", sub: "Kaf", speak: "ك" },
  { char: "ل", word: "লাম", sub: "Lam", speak: "ل" },
  { char: "م", word: "মিম", sub: "Mim", speak: "م" },
  { char: "ن", word: "নুন", sub: "Nun", speak: "ن" },
  { char: "ه", word: "হা (হালকা)", sub: "Ha", speak: "ه" },
  { char: "و", word: "ওয়াও", sub: "Waw", speak: "و" },
  { char: "ي", word: "ইয়া", sub: "Ya", speak: "ي" },
  { char: "ء", word: "হামজা", sub: "Hamza", speak: "ء" },
];

const NUMBERS = (() => {
  const bnWords = [
    "এক",
    "দুই",
    "তিন",
    "চার",
    "পাঁচ",
    "ছয়",
    "সাত",
    "আট",
    "নয়",
    "দশ",
    "এগারো",
    "বারো",
    "তেরো",
    "চৌদ্দ",
    "পনেরো",
    "ষোলো",
    "সতেরো",
    "আঠারো",
    "ঊনিশ",
    "বিশ",
    "একুশ",
    "বাইশ",
    "তেইশ",
    "চব্বিশ",
    "পঁচিশ",
    "ছাব্বিশ",
    "সাতাশ",
    "আটাশ",
    "ঊনত্রিশ",
    "ত্রিশ",
    "একত্রিশ",
    "বত্রিশ",
    "তেত্রিশ",
    "চৌত্রিশ",
    "পঁয়ত্রিশ",
    "ছত্রিশ",
    "সাঁইত্রিশ",
    "আটত্রিশ",
    "ঊনচল্লিশ",
    "চল্লিশ",
    "একচল্লিশ",
    "বিয়াল্লিশ",
    "তেতাল্লিশ",
    "চুয়াল্লিশ",
    "পঁয়তাল্লিশ",
    "ছেচল্লিশ",
    "সাতচল্লিশ",
    "আটচল্লিশ",
    "ঊনপঞ্চাশ",
    "পঞ্চাশ",
    "একান্ন",
    "বায়ান্ন",
    "তিপ্পান্ন",
    "চুয়ান্ন",
    "পঞ্চান্ন",
    "ছাপ্পান্ন",
    "সাতান্ন",
    "আটান্ন",
    "ঊনষাট",
    "ষাট",
    "একষট্টি",
    "বাষট্টি",
    "তেষট্টি",
    "চৌষট্টি",
    "পঁয়ষট্টি",
    "ছেষট্টি",
    "সাতষট্টি",
    "আটষট্টি",
    "ঊনসত্তর",
    "সত্তর",
    "একাত্তর",
    "বাহাত্তর",
    "তিয়াত্তর",
    "চুয়াত্তর",
    "পঁচাত্তর",
    "ছিয়াত্তর",
    "সাতাত্তর",
    "আটাত্তর",
    "ঊনআশি",
    "আশি",
    "একাশি",
    "বিরাশি",
    "তিরাশি",
    "চুরাশি",
    "পঁচাশি",
    "ছিয়াশি",
    "সাতাশি",
    "আটাশি",
    "ঊননব্বই",
    "নব্বই",
    "একানব্বই",
    "বিরানব্বই",
    "তিরানব্বই",
    "চুরানব্বই",
    "পঁচানব্বই",
    "ছিয়ানব্বই",
    "সাতানব্বই",
    "আটানব্বই",
    "নিরানব্বই",
    "একশ",
  ];
  const arr = [];
  for (let i = 1; i <= 100; i++) {
    arr.push({
      char: toBnNumeral(i),
      word: bnWords[i - 1],
      sub: toEnglishNumber(i) + " (" + i + ")",
      count: i,
      speak: bnWords[i - 1]
    });
  }
  return arr;
})();

const ENGLISH_NUMBERS = (() => {
  const arr = [];
  for (let i = 1; i <= 100; i++) {
    arr.push({
      char: String(i),
      word: toEnglishNumber(i),
      sub: toBnNumeral(i),
      count: i,
      speak: toEnglishNumber(i)
    });
  }
  return arr;
})();

/* ছড়া — ব্যবহারকারীর দেওয়া টেক্সট থেকে হুবহু নেওয়া */
const RHYMES = [
  {
    char: "🌙",
    word: "আয় আয় চাঁদ মামা",
    text: "আয় আয় চাঁদ মামা\nটিপ দিয়ে যা,\nচাঁদের কপালে চাঁদ\nটিপ দিয়ে যা।\nমাছ কাটলে মুড়ো দেব,\nধান কুটলে কুঁড়ো দেব,\nকালো গাইয়ের দুধ দেব,\nদুধ খাবার বাটি দেব।\nআয় আয় চাঁদ মামা\nটিপ দিয়ে যা,\nচাঁদের কপালে চাঁদ\nটিপ দিয়ে যা।",
    speak: "আয় আয় চাঁদ মামা টিপ দিয়ে যা, চাঁদের কপালে চাঁদ টিপ দিয়ে যা। মাছ কাটলে মুড়ো দেব, ধান কুটলে কুঁড়ো দেব, কালো গাইয়ের দুধ দেব, দুধ খাবার বাটি দেব। আয় আয় চাঁদ মামা টিপ দিয়ে যা, চাঁদের কপালে চাঁদ টিপ দিয়ে যা।"
  },
  {
    char: "🦜",
    word: "আতা গাছে তোতা পাখি",
    text: "আতা গাছে তোতা পাখি,\nডালিম গাছে মৌ,\nএত ডাকি তবু কেন\nকওনা কথা বউ।",
    speak: "আতা গাছে তোতা পাখি, ডালিম গাছে মৌ, এত ডাকি তবু কেন কওনা কথা বউ।"
  },
  {
    char: "😴",
    word: "খোকা ঘুমালো পাড়া জুড়ালো",
    text: "খোকা ঘুমালো, পাড়া জুড়ালো,\nবর্গী এলো দেশে,\nবুলবুলিতে ধান খেয়েছে,\nখাজনা দেব কিসে?\nধান ফুরালো, পান ফুরালো,\nখাজনার উপায় কি?\nআর কটা দিন সবুর করো,\nরসুন বুনেছি।",
    speak: "খোকা ঘুমালো, পাড়া জুড়ালো, বর্গী এলো দেশে, বুলবুলিতে ধান খেয়েছে, খাজনা দেব কিসে? ধান ফুরালো, পান ফুরালো, খাজনার উপায় কি? আর কটা দিন সবুর করো, রসুন বুনেছি।"
  },
  {
    char: "👶",
    word: "খোকন খোকন ডাক পাড়ি",
    text: "খোকন খোকন ডাক পাড়ি,\nখোকন গেছে কার বাড়ি?\nআয়রে খোকন ঘরে আয়,\nদুধ মাখা ভাত বিড়ালে খায়।",
    speak: "খোকন খোকন ডাক পাড়ি, খোকন গেছে কার বাড়ি? আয়রে খোকন ঘরে আয়, দুধ মাখা ভাত বিড়ালে খায়।"
  },
  {
    char: "🐎",
    word: "আম পাতা জোড়া জোড়া",
    text: "আম পাতা জোড়া জোড়া,\nমারবো চাবুক চড়বো ঘোড়া।\nওরে বুবু সরে দাঁড়া,\nআসছে আমার পাগলা ঘোড়া।\nপাগলা ঘোড়া খেপেছে,\nচাবুক ছুঁড়ে মেরেছে।",
    speak: "আম পাতা জোড়া জোড়া, মারবো চাবুক চড়বো ঘোড়া। ওরে বুবু সরে দাঁড়া, আসছে আমার পাগলা ঘোড়া। পাগলা ঘোড়া খেপেছে, চাবুক ছুঁড়ে মেরেছে।"
  },
  {
    char: "🛶",
    word: "আয় রে আয় টিয়ে",
    text: "আয় রে আয় টিয়ে,\nনায়ে ভরা দিয়ে।\nনা নিয়ে গেল বেয়াল আছে,\nতা দেখে দেখে ভোঁড়া নাচে।\nওরে ভোঁড়া ফিরে চা,\nখোকার নাচন দেখে যা।",
    speak: "আয় রে আয় টিয়ে, নায়ে ভরা দিয়ে। না নিয়ে গেল বেয়াল আছে, তা দেখে দেখে ভোঁড়া নাচে। ওরে ভোঁড়া ফিরে চা, খোকার নাচন দেখে যা।"
  },
  {
    char: "🌧️",
    word: "বৃষ্টি পড়ে টাপুর টুপুর",
    text: "বৃষ্টি পড়ে টাপুর টুপুর,\nনদী এলো বান।\nশিব ঠাকুরের বিয়ে হলো,\nতিন কন্যে দান।\nএক কন্যে রাঁধেন-বাড়েন,\nএক কন্যে খান,\nএক কন্যে না খেয়ে\nবাপের বাড়ি যান।",
    speak: "বৃষ্টি পড়ে টাপুর টুপুর, নদী এলো বান। শিব ঠাকুরের বিয়ে হলো, তিন কন্যে দান। এক কন্যে রাঁধেন-বাড়েন, এক কন্যে খান, এক কন্যে না খেয়ে বাপের বাড়ি যান।"
  },
  {
    char: "🐦",
    word: "কানা বগীর ছা",
    text: "ঐ আমাদের গাঁ,\nঐ খানেতে বাস করে\nকানা বগীর ছা।\nও বগী তুই খাস কী?\nপান্তা ভাত চাস কী?\nপান্তা আমি খাই না,\nপুঁটি মাছ পাই না।\nএকটা যদি পাই,\nঅমনি ধরে গাপুস গুপুস খাই।",
    speak: "ঐ আমাদের গাঁ, ঐ খানেতে বাস করে কানা বগীর ছা। ও বগী তুই খাস কী? পান্তা ভাত চাস কী? পান্তা আমি খাই না, পুঁটি মাছ পাই না। একটা যদি পাই, অমনি ধরে গাপুস গুপুস খাই।"
  },
  {
    char: "🐓",
    word: "মোরগ ডাকে",
    text: "কুককুরকু মোরগ ডাকে,\nমাথায় রাঙ্গা ঝুঁটি।\nতাইনা দেখে খোকা খুকু\nহেসেই লুটোপুটি।",
    speak: "কুককুরকু মোরগ ডাকে, মাথায় রাঙ্গা ঝুঁটি। তাইনা দেখে খোকা খুকু হেসেই লুটোপুটি।"
  },
  {
    char: "👏",
    word: "ইকুড়ি মিকুড়ি",
    text: "ইকুড়ি মিকুড়ি চাম চিকুড়ি,\nচাম কাটে মজুমদার।\nধেয়ে এল দাসুরা।",
    speak: "ইকুড়ি মিকুড়ি চাম চিকুড়ি, চাম কাটে মজুমদার। ধেয়ে এল দাসুরা।"
  }
];

const DATA = {
  vowels: { title: "স্বরবর্ণ", subtitle: "বাংলা স্বরবর্ণ", color: "#FF6B6B", lang: "bn-BD", items: VOWELS },
  consonants: { title: "ব্যঞ্জনবর্ণ", subtitle: "বাংলা ব্যঞ্জনবর্ণ", color: "#FF9F45", lang: "bn-BD", items: CONSONANTS },
  english: { title: "English Alphabet", subtitle: "A to Z", color: "#4D96FF", lang: "en-US", items: ENGLISH_ALPHA },
  fruits: { title: "ফল", subtitle: "ফলের নাম শিখি", color: "#3DDC97", lang: "bn-BD", items: FRUITS },
  flowers: { title: "ফুল", subtitle: "ফুলের নাম শিখি", color: "#FF6FB5", lang: "bn-BD", items: FLOWERS },
  numbers: { title: "সংখ্যা (বাংলা)", subtitle: "১ থেকে ১০০ পর্যন্ত গুনতে শিখি", color: "#A66BFF", lang: "bn-BD", items: NUMBERS },
  numbers_en: { title: "Numbers (English)", subtitle: "১-১০০ ইংরেজি বানান ও উচ্চারণ", color: "#FFA41B", lang: "en-US", items: ENGLISH_NUMBERS },
  arabic: { title: "আরবি হরফ", subtitle: "আরবি বর্ণমালা শিখি (২৯টি)", color: "#2E8B57", lang: "ar-SA", items: ARABIC },
  rhymes: { title: "ছড়া", subtitle: "প্রিয় বাংলা ছড়া শুনি", color: "#FF6B81", lang: "bn-BD", items: RHYMES, noQuiz: true }
};

const CATEGORY_ORDER = ["vowels", "consonants", "english", "fruits", "flowers", "numbers", "numbers_en", "arabic", "rhymes"];
