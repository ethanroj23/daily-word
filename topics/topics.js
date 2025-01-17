

let allVerseDivs;
let globalLastRead = {};
let scrollableVersesParent;

let themes = [
"dark-mode-midnight",
"dark-mode-classic",
"dark-mode-charcoal",
"dark-mode-deep-space",
"dark-mode-slate",
"dark-mode-elegant",
"light-mode-basic",
]

// Localstorage stuff

function setLocalStorageString(name, value){
  localStorage.setItem(name, value);
}

function getLocalStorageString(name){
  return localStorage.getItem(name);
}

function setLocalStorageDict(name, dict){
  localStorage.setItem(name, JSON.stringify(dict));
}

function getLocalStorageDict(name){
  const retrievedItem = localStorage.getItem(name);
  if (retrievedItem) {
    const retrievedDict = JSON.parse(retrievedItem);
    return retrievedDict;
  } else {
    return {};
  }
}

function getLocalStorageList(name){
  const retrievedItem = localStorage.getItem(name);
  if (retrievedItem) {
    const retrievedDict = JSON.parse(retrievedItem);
    return retrievedDict;
  } else {
    return [];
  }
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


// Function to load JSON from a file
function loadTopicsJSON(url, topic) {
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load JSON file');
          }
          return response.json();
      })
      .then(topicalGuideList => {
          let counter = 0;
          let hasSeeAlso = false;
          const topicSeeAlso = topicalGuideList[0];
          const topicalGuideVerses = topicalGuideList.slice(1)
          if (topicSeeAlso.includes("See ")) {
            hasSeeAlso = true;
            addDivSeeAlso(topicSeeAlso);
          }
          for (const verse of topicalGuideVerses){
            addVerseForTopic(verse, counter);
            counter += 1;
          }
          if (counter == 0 && !hasSeeAlso){
            addDivExplainingNoVerses()
          }
          addDivForNextTopic(topic)
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
  console.log(verseToGet);
  const bookUnderscoreWithAbbrev = getAbbrevFromAbbrevVerse(verseToGet);
  const bookUnderscore = unabbreviateBook(bookUnderscoreWithAbbrev, counter).replace(" ", "_");
  verseToGet = verseToGet.replace(bookUnderscoreWithAbbrev, bookUnderscore);


  // create divs
  

  // update div attributes
  const chapter_verse = verseToGet.split(' ')[1].split(':');
  const chapterNumber = chapter_verse[0];
  const verseNumber = chapter_verse[1];

  const volumeIdx = bookToVolumeIdx[bookUnderscore]
  const volumeText = bookUnderscore in bookToVolumeIdx ? volumeIdxToText[volumeIdx] : "Book of Mormon"

  

  // This is to handle situations like 1 Ne 1-8
  if (verseNumber && verseNumber.includes('-') && !verseNumber.includes(',')){
    // Example string
    const parts = verseNumber.split('-');
    const startVerse = parseInt(parts[0], 10);
    const endVerse = parseInt(parts[1], 10);
    for (let x = startVerse; x <= endVerse; x++){
      createScrollableVerseDivs(counter, verseToGet, bookUnderscore, chapterNumber, x, volumeIdx, volumeText, true)
    }
  }
  else{
    createScrollableVerseDivs(counter, verseToGet, bookUnderscore, chapterNumber, verseNumber, volumeIdx, volumeText, false)
  }

}

function createScrollableVerseDivs(counter, verseToGet, bookUnderscore, chapterNumber, verseNumber, volumeIdx, volumeText, isPartOfSection){
  
  let verseFilepath = `/verses/${volumeText}/${bookUnderscore}/${chapterNumber}/${verseNumber}.txt`;
  if (bookUnderscore == "D&C"){
    verseFilepath = `/verses/Doctrine and Covenants/Doctrine_And_Covenants/${chapterNumber}/${verseNumber}.txt`
  }

  const sectionName = `${verseToGet.replace("_", " ")}`;
  const verseName =  `${bookUnderscore.replace("_", " ")} ${chapterNumber}:${verseNumber}`;

  const scrollableVerseDiv = createDiv('scrollable-verse', 'div', '', `verse_${counter}`);
  const verseLink = createDiv('verse-link', 'a');
  const verseTitle = createDiv('verse-title', 'div', sectionName);
  verseTitle.onclick = function(event){
    event.stopPropagation();
  }
  verseTitle.classList.add('roboto-medium');
  const verseContent = createDiv('verse-content', 'div');

  updateDivToVerseText(verseContent, verseFilepath)

  verseLink.href = getVerseLink(volumeIdx, bookUnderscore, chapterNumber, verseNumber)

  // create hierarchy of divs
  verseLink.appendChild(verseTitle)
  
  scrollableVerseDiv.appendChild(verseLink);
  if (isPartOfSection){
    const verseSectionDiv = createDiv('verse-section-title', 'div', verseName);
    scrollableVerseDiv.appendChild(verseSectionDiv);
  }
  scrollableVerseDiv.appendChild(verseContent);
  scrollableVersesParent.appendChild(scrollableVerseDiv);
}

let topicIdx;

function getNextTopic(topic){
  let use_next = false;
  let counter = 0;
  for (const t of topics_list){
    if (use_next){
      return t;
    }
    if (t[0] == topic){
      use_next = true;
      topicIdx = counter;
    }
    counter += 1;
  }
  return ["", "No topic next"];
}










function addDivForNextTopic(topic){
  const nextTopic = getNextTopic(topic);
  
  const nextTopicDiv = createDiv('next-topic', 'div', `Up next: `);
  const nextTopicLink = createDiv('next-topic', 'a', `${nextTopic[1]}`);
  nextTopicLink.href = `/topics/?topic=${nextTopic[0]}`;

  nextTopicDiv.appendChild(nextTopicLink)
  const scrollableVersesParent = document.getElementById('scrollable_verses_parent');
  scrollableVersesParent.appendChild(nextTopicDiv);

  const loadNextTopicDiv = createDiv('load-next-topic', 'div');
  scrollableVersesParent.appendChild(loadNextTopicDiv);
}

function addDivSeeAlso(seeAlso){
  const toSplit = seeAlso.replace("See also ", "").replace("See ", "");
  const seeAlsoList = toSplit.split("; ")

  const seeAlsoDiv = createDiv('scrollable-verse', 'div')
  const seeAlsoContentDiv = createDiv('verse-content', 'div', "See also ")

  for (const s of seeAlsoList){
      const a = createDiv('see-also-inner', 'a', s+'; ');
      a.href = `/topics/?topic=${topics_dict[s]}`;
      seeAlsoContentDiv.appendChild(a);
  }

  const scrollableVersesParent = document.getElementById('scrollable_verses_parent');
  seeAlsoDiv.appendChild(seeAlsoContentDiv);
  scrollableVersesParent.appendChild(seeAlsoDiv);
}

function addDivExplainingNoVerses(){
  const noVerses = createDiv('no-verses', 'div', 'There are no verses for this topic')
  noVerses.classList.add("scrollable-verse");
  const scrollableVersesParent = document.getElementById('scrollable_verses_parent');
  scrollableVersesParent.appendChild(noVerses);
}

function addSearchListener(){
  // Get references to the input box and the list items
  const searchBox = document.getElementById('search_box');
  const listItems = document.querySelectorAll('.toc-topic');
  
  // Function to filter the list based on user input
  searchBox.addEventListener('input', function() {
    const searchTerm = searchBox.value.toLowerCase();  // Convert to lowercase for case-insensitive matching
  
    listItems.forEach(function(item) {
      const itemText = item.textContent.toLowerCase();
      if (itemText.includes(searchTerm)) {
        item.classList.remove('hidden');  // Show item
      } else {
        item.classList.add('hidden');  // Hide item
      }
    });
  });
}

function addDivForSearch(){
  const search = createDiv('search-box', 'input', '', 'search_box');
  search.placeholder = "Search..."
  search.type = "text";

  const scrollableVersesParent = document.getElementById('toc_parent');
  scrollableVersesParent.prepend(search);
}

function themePickerOnclick(){
  this.className = "theme-picker";
  let nextTheme = themes[0];
  let useNext = false;
  for (const theme of themes){
    if (useNext){
      nextTheme = theme;
      break;
    }
    if (theme == currentTheme){
      useNext = true;
    }
  }

  currentTheme = nextTheme;
  setLocalStorageString('theme', currentTheme);
  this.classList.add(currentTheme)
  document.body.className = currentTheme;
}

let currentTheme;

function initTheme(){
  const savedTheme = getLocalStorageString('theme');
  if (savedTheme){
    currentTheme = savedTheme;
  }
  else{
    currentTheme = themes[0];
  }
  return currentTheme;
}

function addDivForThemePicker(){
  const themePicker = createDiv('theme-picker', 'div', 'Change Theme');
  const currentTheme = initTheme();
  themePicker.classList.add(currentTheme);
  document.body.classList.add(currentTheme);
  themePicker.onclick = themePickerOnclick;


  const scrollableVersesParent = document.getElementById('toc_parent');
  scrollableVersesParent.prepend(themePicker);
}

function addHomePageSection(text){
  const recentlyRead = createDiv('home-page-section', 'div', text);
  const scrollableVersesParent = document.getElementById('toc_parent');
  scrollableVersesParent.appendChild(recentlyRead);
}

function addDivForTopic(topic){
  const tocTopic = createDiv('toc-topic', 'div');
  const tocTopicA = createDiv('toc-topic-a', 'a', topic[1]);
  tocTopicA.href = `/topics/?topic=${topic[0]}`;
  const tocParent = document.getElementById('toc_parent');
  tocTopic.appendChild(tocTopicA);
  tocParent.appendChild(tocTopic);
  tocTopic.classList.add("home-page-item")
  return tocTopic;
}



function afterLoadingVerses(){
  // This is because of a weird bug with ios not properly honoring scroll-snap-type
  tapScrollDist = document.getElementsByClassName("scrollable-verse")[0].getBoundingClientRect().height
  globalLastRead = getLocalStorageDict('lastReadVerse');

    if (topicIdx in globalLastRead){
      const last_read = globalLastRead[topicIdx];
      const last_read_div = document.getElementById(`verse_${last_read}`);
      if (last_read_div){
        last_read_div.scrollIntoView();
      }
    }
  allVerseDivs = document.querySelectorAll('.scrollable-verse');
}

function setupTopicListPage(){
      document.getElementById("scrollable_verses_parent").onclick = null; // because otherwise the page moves when you tap which is wanted for the reader pages, but not the home page


      addDivForSearch();
      addDivForThemePicker();
      globalLastRead = getLocalStorageDict('lastReadVerse');
      const recents = getLocalStorageList('recently_read');
      const saved = getLocalStorageList('saved');
      if (recents) addHomePageSection('Recents');
      
      for (const topic of recents){
        const topicWithDisplayname = [topic, getTopicDisplayName(topic)];
        addDivForTopic(topicWithDisplayname);
      }
      if (saved) addHomePageSection('Saved');
      
      for (const topic of saved){
        const topicWithDisplayname = [topic, getTopicDisplayName(topic)];
        addDivForTopic(topicWithDisplayname);
      }

      let startedList = [];
      let finishedList = [];
      Object.keys(globalLastRead).forEach(topicIdx => {
        const has_finished = globalLastRead[topicIdx] == "-1";
        if (has_finished) finishedList.push([topics_list[topicIdx][0], topics_list[topicIdx][1]])
        else startedList.push([topics_list[topicIdx][0], topics_list[topicIdx][1]])
      });



      if (startedList.length != 0) {
        addHomePageSection('Started');
        for (const t of startedList){
          addDivForTopic(t);
        }
      }

      if (finishedList.length != 0) {
        addHomePageSection('Finished');
        for (const t of finishedList){
          addDivForTopic(t);
        }
      }


      addHomePageSection('Recommended');
      for (const t of topics_sorted_by_ref_count){
        const topicWithDisplayname = [t[0], getTopicDisplayName(t[0])];
        addDivForTopic(topicWithDisplayname);
      }

      addHomePageSection('All Topics');
      for (const topic of topics_list){
        addDivForTopic(topic);
      }
      addSearchListener();
}

let screenHeight = window.innerHeight;

function getTopicDisplayName(topic){
  for (const t of topics_list){
    if (t[0] == topic){
      return t[1];
    }
  }
}

function removeFromList(inputList, value){
let index = inputList.indexOf(value);
  if (index !== -1) {
    inputList.splice(index, 1);
  }
}



function addHomeButton(){
    const homeButton = createDiv('home-button', 'a')
    const saveButton = createDiv('save-button', 'img')
    homeButton.href = "/topics/"
    const homeLogo = createDiv('home-logo', 'img');
    homeLogo.src = "/icons/tg192transparent.png";
    saveButton.src = getLocalStorageList('saved').includes(globalTopic) ? "/icons/saved.png" : "/icons/save.png";
    homeButton.appendChild(homeLogo);

    saveButton.onclick = function() {
      const isSaved = getLocalStorageList('saved');
      const topic = topics_list[topicIdx][0]
      if (isSaved.includes(topic)){
        this.src = "/icons/save.png";
        removeFromList(isSaved, topic);
      }
      else{
        this.src = "/icons/saved.png";
        isSaved.unshift(topic);
      }
      setLocalStorageDict('saved', isSaved);
    }

    const parent = document.getElementById('inner_body_header');
    const child = document.getElementById('inner_body_header_link');
    parent.insertBefore(homeButton, child);
    parent.appendChild(saveButton);
}

let globalTopic;
let tapScrollDist
//onload
function pageLoaded() {
  scrollableVersesParent = document.getElementById("scrollable_verses_parent");
  tapScrollDist = window.innerHeight;
  const params = new URLSearchParams(window.location.search);
  if (params.has('topic')){
    document.body.className = initTheme();
    
    const topic = params.get('topic')
    globalTopic = topic;

    const recentlyRead = getLocalStorageList('recently_read');
    if (recentlyRead.includes(topic)){
      removeFromList(recentlyRead, topic);
    }
    recentlyRead.unshift(topic);
    recentlyRead.splice(5);
    setLocalStorageDict('recently_read', recentlyRead);

    const header_link = document.getElementById("inner_body_header_link")
    header_link.classList.add('roboto-medium');
    header_link.textContent = getTopicDisplayName(topic);
    header_link.href = `https://www.churchofjesuschrist.org/study/scriptures/tg/${topic}?lang=eng`;

    addHomeButton();
    loadTopicsJSON(`/topics/data/${topic}.json`, topic)
  }
  else{
    setupTopicListPage()
  }


  function checkVisibility() {
    for (const item of allVerseDivs) {
      const rect = item.getBoundingClientRect();
      if (rect.top >= 0) {
        return item.id;
      }
    };
    return "-1" // this usually means they are on the end of the chapter
  }

const scrollDiv = document.getElementById('scrollable_verses_parent');
let scrollTimeout;
scrollDiv.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function() {
        console.log('Scrolling stopped!');
        const lastReadVerse = checkVisibility();

        globalLastRead[topicIdx] = lastReadVerse.replace("verse_", "");
        setLocalStorageDict('lastReadVerse', globalLastRead);
        const div = document.querySelector('.load-next-topic');
        const rect = div.getBoundingClientRect();
        console.log(rect.top);
        if (rect.top < screenHeight){
          window.location.href = document.querySelector('a.next-topic').href;
        }
    }, 200); // 200ms delay (you can adjust this value)
});
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



