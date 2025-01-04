



const colorOfDay = [
    '#ACF39D',
    '#E85F5C',
    '#AED1FE',
    '#BEB7DF',
    '#FDC05D',
    '#FFC4D1',
    'white',
]


// Function to load JSON from a file
function loadTopicsJSON(url) {
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load JSON file');
          }
          return response.json();
      })
      .then(topicalGuideVerses => {
          let counter = 0;
          for (const verse of topicalGuideVerses){
            addVerseForTopic(verse, counter);
            counter += 1;
          }
          if (counter == 0){
            addDivExplainingNoVerses()
          }
          afterLoadingVerses();
      })
      .catch(error => {
          console.error('Error loading JSON:', error);
      });
}






function httpCallback(response){
  alert(response)
}

async function updateDivToVerseText(el, fileToGet) {
let text_data = "";
try {
  response = await fetch(fileToGet);
  if(response.status != 200) {
    throw new Error("Server Error");
  }
  text_data = await response.text();
}
catch {
  text_data = `Unable to find ${fileToGet}`;
}
el.textContent = text_data;
}


function unabbreviateBook(book, counter){
  if (book.includes('.')){
    for (const volume in footnoteAbbrevs){
      for (const shortBook in footnoteAbbrevs[volume]){
        if (book == '1 Cor.'){
          console.log('shortBook', shortBook)
        }
        if (shortBook == book){
          return footnoteAbbrevs[volume][shortBook];
        }
      }
    }
    console.log(`Abbreviated version not found for ${book} - ${counter}`);
  }
  return book;
}

function createDiv(classToAdd, typeToAdd, textToAdd='', idToAdd=''){
  const newDiv = document.createElement(typeToAdd);
  newDiv.classList.add(classToAdd);
  if (textToAdd != '') {
    newDiv.textContent = textToAdd;
  }
  if (idToAdd != '') {
    newDiv.id = idToAdd;
  }
  return newDiv;
}

function getAbbrevFromAbbrevVerse(abbrevVerse){
  const regex = /(.*?) ([0-9]+:[0-9])/;
  const match = abbrevVerse.match(regex);
  if (match) {
    return match[1]
  } else {
    return "No match found"
  }
}


const volumeIdxToUrlSection = [
  'ot',
  'nt',
  'bofm',
  'dc-testament',
  'pgp',
]

function getVerseLink(volumeIdx, bookUnderscore, chapterNumber, verseNumber){
  const baseUrl = 'https://www.churchofjesuschrist.org/study/scriptures'
  if (bookUnderscore == "D&C"){
    return `${baseUrl}/${volumeIdxToUrlSection[volumeIdx]}/dc/${chapterNumber}?lang=eng&id=p${verseNumber}#p${verseNumber}`
  }

  return `${baseUrl}/${volumeIdxToUrlSection[volumeIdx]}/${urlAbbrevs[bookUnderscore]}/${chapterNumber}?lang=eng&id=p${verseNumber}#p${verseNumber}`
}

function addVerseForTopic(verseToGet, counter){
  
  const bookUnderscoreWithAbbrev = getAbbrevFromAbbrevVerse(verseToGet);
  const bookUnderscore = unabbreviateBook(bookUnderscoreWithAbbrev, counter).replace(" ", "_");
  verseToGet = verseToGet.replace(bookUnderscoreWithAbbrev, bookUnderscore);

  const scrollableVersesParent = document.getElementById('scrollable_verses_parent');

  // create divs
  const parentDiv = createDiv('scrollable-verse', 'div', '', `verse_${counter}`);
  const verseLink = createDiv('verse-link', 'a');
  const verseTitle = createDiv('verse-title', 'div', `${verseToGet.replace("_", " ")}`);
  verseTitle.classList.add('roboto-medium');
  const verseContent = createDiv('verse-content', 'div');

  // update div attributes
  const chapter_verse = verseToGet.split(' ')[1].split(':');
  const chapterNumber = chapter_verse[0];
  const verseNumber = chapter_verse[1];
  const volumeIdx = bookToVolumeIdx[bookUnderscore]
  const volumeText = bookUnderscore in bookToVolumeIdx ? volumeIdxToText[volumeIdx] : "Book of Mormon"

  let verseFilepath = `/verses/${volumeText}/${bookUnderscore}/${chapterNumber}/${verseNumber}.txt`;
  if (bookUnderscore == "D&C"){
    verseFilepath = `/verses/Doctrine and Covenants/Doctrine_And_Covenants/${chapterNumber}/${verseNumber}.txt`
  }

  updateDivToVerseText(verseContent, verseFilepath)

  verseLink.href = getVerseLink(volumeIdx, bookUnderscore, chapterNumber, verseNumber)


  // create hierarchy of divs
  verseLink.appendChild(verseTitle)
  parentDiv.appendChild(verseLink);
  parentDiv.appendChild(verseContent);
  scrollableVersesParent.appendChild(parentDiv);
}

function addDivExplainingNoVerses(){
  const noVerses = createDiv('no-verses', 'div', 'There are no verses for this topic')
  const scrollableVersesParent = document.getElementById('scrollable_verses_parent');
  scrollableVersesParent.appendChild(noVerses);
}

function addDivForTopic(topic){
  const tocTopic = createDiv('toc-topic', 'div');
  const tocTopicA = createDiv('toc-topic-a', 'a', topic);
  tocTopicA.href = `/topics/?topic=${topic}`;
  const tocParent = document.getElementById('toc_parent');
  tocTopic.appendChild(tocTopicA);
  tocParent.appendChild(tocTopic);
}



function afterLoadingVerses(){
  const params = new URLSearchParams(window.location.search);
  if (params.has('last_read')){
    const last_read = params.get('last_read');
    document.getElementById(last_read).scrollIntoView();
  }
}

function setupTopicListPage(){
  fetch('/topics/topics_list.json')
  .then(response => {
      if (!response.ok) {throw new Error('Failed to load JSON file');}
      return response.json();
  })
  .then(topics => {
      for (const topic of topics){
        addDivForTopic(topic);
      }
  })
  .catch(error => {console.error('Error loading JSON:', error);});
}

//onload
function pageLoaded() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('colormode')){
    document.body.classList.add(`dark-mode-${params.get('colormode')}`);
  }
  if (params.has('topic')){
    const topic = params.get('topic')
    const header_link = document.getElementById("inner_body_header_link")
    header_link.classList.add('roboto-medium');
    header_link.textContent = topic;
    header_link.href = `https://www.churchofjesuschrist.org/study/scriptures/tg/${topic}?lang=eng`;
    loadTopicsJSON(`/topics/data/${topic}.json`)
  }
  else{
    setupTopicListPage()
  }
}





var timer = null;
var selectedRange = null;
var getSelectedRange = function() {
  try {
      if (window.getSelection) {
          selectedRange = window.getSelection().getRangeAt(0);
      } else {
          selectedRange = document.getSelection().getRangeAt(0);
      }
  } catch (err) {

  }

};


function highlightFromLS(start, end, color, wait) {
  
}


function highlightSelectedText(color, add=true) {
  if (selectedRange) {
    var span = document.createElement('span');
    span.className = 'highlight-' + color + " highlight";
    selectedRange.surroundContents(span);
    if (add) addHighlightToLS();
  }
}


function renderHighlights(){
  var originalElement = document.getElementById('verse');
  var newHTMLContent = localStorage.getItem('verse');
  var newElement = document.createElement('div');
  newElement.innerHTML = newHTMLContent;
  originalElement.replaceWith(newElement);
}


function addHighlightToLS(){
  localStorage.setItem('verse', document.getElementById('verse').outerHTML);
}

/* Highlighter code */
function removeHighlight() {
  localStorage.setItem('verse', '');
  var highlightedElements = document.querySelectorAll('.highlight');
  highlightedElements.forEach(function(element) {
    var parent = element.parentNode;
    parent.replaceChild(document.createTextNode(element.textContent), element);
  });
}

function bodyClicked(){
  var ui = document.querySelector('.highlight-ui');
  ui.style.opacity = 1;
}

function hideUI(e){
  e.stopPropagation();
  console.log('hide UI');
  var ui = document.querySelector('.highlight-ui');
  ui.style.opacity = 0;
}

const COLOR_COUNT = 6;
function addHighlightEventListeners(){

  document.body.addEventListener('click', function() {
    bodyClicked();
  });

  for (let x=0; x<COLOR_COUNT; x++){
    document.getElementById('highlight'+x).addEventListener('click', function() {
      highlightSelectedText(x);
    });
  }
  
  document.getElementById('removeHighlight').addEventListener('click', removeHighlight);
}

const scripture_citation_index = {
  "1 Nephi": "https://scriptures.byu.edu/#::c0cd",
  "2 Nephi": "https://scriptures.byu.edu/#::c0ce",
  "Jacob": "https://scriptures.byu.edu/#::c0cf",
  "Enos": "https://scriptures.byu.edu/#::c0d0",
  "Jarom": "https://scriptures.byu.edu/#::c0d1",
  "Omni": "https://scriptures.byu.edu/#::c0d2",
  "Words of Mormon": "https://scriptures.byu.edu/#::c0d3",
  "Mosiah": "https://scriptures.byu.edu/#::c0d4",
  "Alma": "https://scriptures.byu.edu/#::c0d5",
  "Helaman": "https://scriptures.byu.edu/#::c0d6",
  "3 Nephi": "https://scriptures.byu.edu/#::c0d7",
  "4 Nephi": "https://scriptures.byu.edu/#::c0d8",
  "Mormon": "https://scriptures.byu.edu/#::c0d9",
  "Ether": "https://scriptures.byu.edu/#::c0da",
  "Moroni": "https://scriptures.byu.edu/#::c0db",
}




async function updateText(fileToGet) {
    console.log('getting: ', fileToGet)
  let text_data = "";
  try {
	  response = await fetch(fileToGet);
    if(response.status != 200) {
      throw new Error("Server Error");
    }
    text_data = await response.text();
  }
  catch {
    text_data = "Ye cannot say, when ye are brought to that awful crisis, that I will repent, that I will return to my God. Nay, ye cannot say this; for that same spirit which doth possess your bodies at the time that ye go out of this life, that same spirit will have power to possess your body in that eternal world. (local)";
  }
		
  document.getElementById("verse").textContent = text_data;
  if (localStorage.getItem('verse') != ''){
    renderHighlights();
  }
}


const verses = ['Alma 31:15',
'Helaman 15:7',
'Jacob 6:8',
'Alma 6:8',
'Mormon 9:37',
]

const volumeIdxToText = [
  'Old Testament',
  'New Testament',
  'Book of Mormon',
  'Doctrine and Covenants',
  'Pearl of Great Price'
]

const bookToVolumeIdx = {
  "Genesis":0,
        "Exodus":0,
        "Leviticus": 0,
        "Numbers": 0,
        "Deuteronomy": 0,
        "Joshua": 0,
        "Judges": 0,
        "Ruth": 0,
        "1_Samuel": 0,
        "2_Samuel": 0,
        "1_Kings": 0,
        "2_Kings": 0,
        "1_Chronicles": 0,
        "2_Chronicles": 0,
        "Ezra": 0,
        "Nehemiah": 0,
        "Esther": 0,
        "Job": 0,
        "Psalms": 0,
        "Proverbs": 0,
        "Ecclesiastes": 0,
        "Solomons_Song": 0,
        "Isaiah": 0,
        "Jeremiah": 0,
        "Lamentations": 0,
        "Ezekiel": 0,
        "Daniel": 0,
        "Hosea": 0,
        "Joel": 0,
        "Amos": 0,
        "Obadiah": 0,
        "Jonah": 0,
        "Micah": 0,
        "Nahum": 0,
        "Habakkuk": 0,
        "Zephaniah": 0,
        "Haggai": 0,
        "Zechariah": 0,
        "Malachi": 0,

        "Matthew": 1,
        "Mark": 1,
        "Luke": 1,
        "John": 1,
        "Acts": 1,
        "Romans": 1,
        "1_Corinthians": 1,
        "2_Corinthians": 1,
        "Galatians": 1,
        "Ephesians": 1,
        "Philippians": 1,
        "Colossians": 1,
        "1_Thessalonians": 1,
        "2_Thessalonians": 1,
        "1_Timothy": 1,
        "2_Timothy": 1,
        "Titus": 1,
        "Philemon": 1,
        "Hebrews": 1,
        "James": 1,
        "1_Peter": 1,
        "2_Peter": 1,
        "1_John": 1,
        "2_John": 1,
        "3_John": 1,
        "Jude": 1,
        "Revelation": 1,

        "1_Nephi": 2,
        "2_Nephi": 2,
        "Jacob": 2,
        "Enos": 2,
        "Jarom": 2,
        "Omni": 2,
        "Words_of_Mormon": 2,
        "Mosiah": 2,
        "Alma": 2,
        "Helaman": 2,
        "3_Nephi": 2,
        "4_Nephi": 2,
        "Mormon": 2,
        "Ether": 2,
        "Moroni": 2,

        "D&C": 3,

        "Moses": 4,
        "Abraham": 4,
        "Joseph_Smith_Matthew": 4,
        "Joseph_Smith_History": 4,
        "Articles_of_Faith": 4


}



const urlAbbrevs = {
  "Genesis": "gen",
  "Exodus": "ex",
  "Leviticus": "lev",
  "Numbers": "num",
  "Deuteronomy": "deut",
  "Joshua": "josh",
  "Judges": "judg",
  "Ruth": "ruth",
  "1_Samuel": "1-sam",
  "2_Samuel": "2-sam",
  "1_Kings": "1-kgs",
  "2_Kings": "2-kgs",
  "1_Chronicles": "1-chr",
  "2_Chronicles": "2-chr",
  "Ezra": "ezra",
  "Nehemiah": "neh",
  "Esther": "esth",
  "Job": "job",
  "Psalms": "ps",
  "Proverbs": "prov",
  "Ecclesiastes": "eccl",
  "Solomons_Song": "song",
  "Isaiah": "isa",
  "Jeremiah": "jer",
  "Lamentations": "lam",
  "Ezekiel": "ezek",
  "Daniel": "dan",
  "Hosea": "hosea",
  "Joel": "joel",
  "Amos": "amos",
  "Obadiah": "obad",
  "Jonah": "jonah",
  "Micah": "micah",
  "Nahum": "nahum",
  "Habakkuk": "hab",
  "Zephaniah": "zeph",
  "Haggai": "hag",
  "Zechariah": "zech",
  "Malachi": "mal",
 
  "Matthew": "matt",
  "Mark": "mark",
  "Luke": "luke",
  "John": "john",
  "Acts": "acts",
  "Romans": "rom",
  "1_Corinthians": "1-cor",
  "2_Corinthians": "2-cor",
  "Galatians": "gal",
  "Ephesians": "eph",
  "Philippians": "philip",
  "Colossians": "col",
  "1_Thessalonians": "1-thes",
  "2_Thessalonians": "2-thes",
  "1_Timothy": "1-tim",
  "2_Timothy": "2-tim",
  "Titus": "titus",
  "Philemon": "philem",
  "Hebrews": "heb",
  "James": "james",
  "1_Peter": "1-pet",
  "2_Peter": "2-pet",
  "1_John": "1-jn",
  "2_John": "2-jn",
  "3_John": "3-jn",
  "Jude": "jude",
  "Revelation": "rev",
 
  "1_Nephi": "1-ne",
  "2_Nephi": "2-ne",
  "Jacob": "jacob",
  "enos": "enos",
  "Jarom": "jarom",
  "Omni": "omni",
  "Words_of_Mormon": "w-of-m",
  "Mosiah": "mosiah",
  "Alma": "alma",
  "Helaman": "hel",
  "3_Nephi": "3-ne",
  "4_Nephi": "4-ne",
  "Mormon": "morm",
  "Ether": "ether",
  "Moroni": "moro",
 
 
  "Moses": "moses",
  "Abraham": "abr",
  "Joseph_Smith_Matthew": "js-m",
  "Joseph_Smith_History": "js-h",
  "Articles_of_Faith": "a-of-f",
  }

  





const footnoteAbbrevs = {
    "Old Testament": {
        "Gen.": "Genesis",
        "Ex.": "Exodus",
        "Lev.": "Leviticus",
        "Num.": "Numbers",
        "Deut.": "Deuteronomy",
        "Josh.": "Joshua",
        "Judg.": "Judges",
        "Ruth": "Ruth",
        "1 Sam.": "1 Samuel",
        "2 Sam.": "2 Samuel",
        "1 Kgs.": "1 Kings",
        "2 Kgs.": "2 Kings",
        "1 Chr.": "1 Chronicles",
        "2 Chr.": "2 Chronicles",
        "Ezra": "Ezra",
        "Neh.": "Nehemiah",
        "Esth.": "Esther",
        "Job": "Job",
        "Ps.": "Psalms",
        "Prov.": "Proverbs",
        "Eccl.": "Ecclesiastes",
        "Song": "Song of Solomon",
        "Isa.": "Isaiah",
        "Jer.": "Jeremiah",
        "Lam.": "Lamentations",
        "Ezek.": "Ezekiel",
        "Dan.": "Daniel",
        "Hosea": "Hosea",
        "Joel": "Joel",
        "Amos": "Amos",
        "Obad.": "Obadiah",
        "Jonah": "Jonah",
        "Micah": "Micah",
        "Nahum": "Nahum",
        "Hab.": "Habakkuk",
        "Zeph.": "Zephaniah",
        "Hag.": "Haggai",
        "Zech.": "Zechariah",
        "Mal.": "Malachi",
        },
    "New Testament":{
        "Matt.": "Matthew",
        "Mark": "Mark",
        "Luke": "Luke",
        "John": "John",
        "Acts": "Acts",
        "Rom.": "Romans",
        "1 Cor.": "1 Corinthians",
        "2 Cor.": "2 Corinthians",
        "Gal.": "Galatians",
        "Eph.": "Ephesians",
        "Philip.": "Philippians",
        "Col.": "Colossians",
        "1 Thes.": "1 Thessalonians",
        "2 Thes.": "2 Thessalonians",
        "1 Tim.": "1 Timothy",
        "2 Tim.": "2 Timothy",
        "Titus": "Titus",
        "Philem.": "Philemon",
        "Heb.": "Hebrews",
        "James": "James",
        "1 Pet.": "1 Peter",
        "2 Pet.": "2 Peter",
        "1 Jn.": "1 John",
        "2 Jn.": "2 John",
        "3 Jn.": "3 John",
        "Jude": "Jude",
        "Rev.": "Revelation",
    },
    "Book of Mormon": {
        "1 Ne.": "1 Nephi",
        "2 Ne.": "2 Nephi",
        "Jacob": "Jacob",
        "Enos": "Enos",
        "Jarom": "Jarom",
        "Omni": "Omni",
        "W of M": "Words of Mormon",
        "Mosiah": "Mosiah",
        "Alma": "Alma",
        "Hel.": "Helaman",
        "3 Ne.": "3 Nephi",
        "4 Ne.": "4 Nephi",
        "Morm.": "Mormon",
        "Ether": "Ether",
        "Moro.": "Moroni",
    },
    "Doctrine and Covenants": {
        "D & C": "Doctrine and Covenants"
    },
    "Pearl of Great Price": {
        "Moses": "Moses",
        "Abr.": "Abraham",
        "JS—M": "Joseph Smith—Matthew",
        "JS—H": "Joseph Smith—History",
        "A of F": "Articles of Faith",
    }
}



