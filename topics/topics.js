

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2023, 9, 12);

function getDaysSince(){
    const secondDate = new Date();
    const diffDays = Math.floor(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays
}

function getFormattedDate(){
    const d = new Date();
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
    const year = d.getFullYear();
    return month + ' ' + d.getDate() + ', ' + year;
}

const colorOfDay = [
    '#ACF39D',
    '#E85F5C',
    '#AED1FE',
    '#BEB7DF',
    '#FDC05D',
    '#FFC4D1',
    'white',
]





function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
    
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
  text_data = "Ye cannot say, when ye are brought to that awful crisis, that I will repent, that I will return to my God. Nay, ye cannot say this; for that same spirit which doth possess your bodies at the time that ye go out of this life, that same spirit will have power to possess your body in that eternal world. (local)";
}
  
el.textContent = text_data;
}






function unabbreviateBook(book){
  if (book.includes('.')){
    for (const volume in footnoteAbbrevs){
      for (const shortBook in footnoteAbbrevs[volume]){
        if (shortBook == book){
          return footnoteAbbrevs[volume][shortBook];
        }
      }
    }
  }
  console.log("Abbreviated version not found");
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



function addVerseForTopic(verseToGet, counter){
  const bookUnderscoreWithAbbrev = verseToGet.split(' ')[0];
  const bookUnderscore = unabbreviateBook(bookUnderscoreWithAbbrev);
  verseToGet = verseToGet.replace(bookUnderscoreWithAbbrev, bookUnderscore);

  const scrollableVersesParent = document.getElementById('scrollable_verses_parent');

  // create divs
  const parentDiv = createDiv('scrollable-verse', 'div', '', `verse_${counter}`);
  const verseLink = createDiv('verse-link', 'a');
  const verseTitle = createDiv('verse-title', 'div', `${verseToGet} (${counter})`);
  const verseContent = createDiv('verse-content', 'div');

  // update div attributes
  const chapter_verse = verseToGet.split(' ')[1].split(':');
  const chapterNumber = chapter_verse[0];
  const verseNumber = chapter_verse[1];
  const volumeText = bookUnderscore in bookToVolumeIdx ? volumeIdxToText[bookToVolumeIdx[bookUnderscore]] : "Book of Mormon"

  updateDivToVerseText(verseContent, `/verses/${volumeText}/${bookUnderscore}/${chapterNumber}/${verseNumber}.txt`)

  verseLink.href = `https://www.churchofjesuschrist.org/study/scriptures/bofm/${abbrevs[bookUnderscore]}/${chapterNumber}?lang=eng&id=p${verseNumber}#p${verseNumber}`

  // create hierarchy of divs
  verseLink.appendChild(verseTitle)
  parentDiv.appendChild(verseLink);
  parentDiv.appendChild(verseContent);
  scrollableVersesParent.appendChild(parentDiv);
}



function pageLoaded() {
  console.log("pageLoaded")
  // TODO:  Try to figure out this part later if you want
  //httpGetAsync("https://www.churchofjesuschrist.org/study/scriptures/tg/abide?lang=eng", httpCallback)
  console.log("after pageLoaded")
  document.getElementById("inner_body_header").textContent = "God the Father";


  let counter = 0;
  for (const verse of godTheFatherTopicalGuide){
    addVerseForTopic(verse, counter);
    counter += 1;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has('last_read')){
    const last_read = params.get('last_read');
    console.log(last_read);
    document.getElementById(last_read).scrollIntoView();
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



const abbrevs = {
  '1_Nephi': '1-ne',
  '2_Nephi': '2-ne',
  '3_Nephi': '3-ne',
  '4_Nephi': '4-ne',
  'Alma': 'alma',
  'Enos': 'enos',
  'Ether': 'ether',
  'Helaman': 'hel',
  'Jacob': 'jacob',
  'Jarom': 'jarom',
  'Mormon': 'morm',
  'Moroni': 'moro',
  'Mosiah': 'mosiah',
  'Omni': 'omni',
  'Words_of_Mormon': 'w-of-m',
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



const godTheFatherTopicalGuide = [
"Gen. 14:19",
"Num. 16:22 (27:16)",
"Mal. 2:10",
"Matt. 3:17",
"Matt. 5:16",
"Matt. 5:48",
"Matt. 6:6 (3 Ne. 13:6)",
"Matt. 6:9 (Luke 11:2; 3 Ne. 13:9)",
"Matt. 6:15 (Mark 11:26; 3 Ne. 13:15)",
"Matt. 7:21 (3 Ne. 14:21)",
"Matt. 10:32",
"Matt. 11:27 (Luke 10:22)",
"Matt. 12:50",
"Matt. 16:17",
"Matt. 17:5",
"Matt. 18:10",
"Matt. 20:23",
"Matt. 23:9",
"Matt. 24:36 (Mark 13:32; JS—M 1:40)",
"Matt. 26:39 (Luke 22:42)",
"Matt. 28:19",
"Luke 2:49",
"Luke 6:36",
"Luke 23:34",
"Luke 23:46",
"Luke 24:49",
"John 1:14",
"John 2:16",
"John 3:16",
"John 3:35 (5:20)",
"John 4:23",
"John 5:18",
"John 5:19",
"John 5:30",
"John 5:37 (8:18)",
"John 5:43 (10:25)",
"John 6:37",
"John 6:45",
"John 8:18",
"John 8:28",
"John 8:54",
"John 10:15",
"John 10:30",
"John 12:26",
"John 12:49",
"John 14:2",
"John 14:6",
"John 14:9",
"John 14:10 (14:20; D&C 93:3)",
"John 14:12 (14:28; 16:16)",
"John 14:28",
"John 15:1",
"John 15:16 (16:23)",
"John 15:23",
"John 16:3",
"John 16:15",
"John 16:28",
"John 16:32",
"John 17:21",
"John 20:17",
"John 20:21",
"Acts 7:56",
"Rom. 8:15",
"Rom. 15:6",
"1 Cor. 8:6",
"1 Cor. 11:13",
"Eph. 2:18",
"Eph. 3:14",
"Eph. 4:6",
"Heb. 1:5",
"Heb. 12:9",
"James 1:17",
"1 Jn. 1:3",
"1 Jn. 2:1",
"1 Jn. 2:15",
"1 Jn. 4:14",
"1 Jn. 5:7",
"2 Jn. 1:9",
"Rev. 3:5",
"1 Ne. 11:21",
"2 Ne. 31:21",
"Alma 11:44",
"3 Ne. 11:25",
"3 Ne. 18:27",
"Morm. 7:7",
"D&C 15:6",
"D&C 20:24",
"D&C 27:14",
"D&C 63:34",
"D&C 76:20",
"D&C 84:63",
"D&C 84:83",
"D&C 88:75",
"D&C 93:17",
"D&C 121:32",
"D&C 130:22",
"D&C 137:3",
"D&C 138:14",
"Moses 4:2",
"Abr. 3:19",
"Abr. 3:27",
"JS—H 1:17",
"A of F 1:1",
  ]