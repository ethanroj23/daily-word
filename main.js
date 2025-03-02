

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

function apiUrlDailyOnload(){
  const idx = getDaysSince();
  let verseToGet = verses[idx];
  let customVerse = false;

  // If the user defined query params, use those instead to determine verse
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('book') && urlParams.has('chapter') && urlParams.has('verse')){
      customVerse = true;
      verseToGet = urlParams.get('book').replace(' ', '_')+' '+urlParams.get('chapter')+':'+urlParams.get('verse')
  }

  const bookUnderscore = verseToGet.split(' ')[0];
  const chapter_verse = verseToGet.split(' ')[1].split(':');
  const chapter = chapter_verse[0];
  const verse = chapter_verse[1];

  const daily_url = `https://www.churchofjesuschrist.org/study/scriptures/bofm/${abbrevs[bookUnderscore]}/${chapter}?lang=eng&id=p${verse}#p${verse}`
  document.getElementsByClassName("inner-body")[0].textContent = daily_url;
}

function pageLoaded(){
    timer = setInterval(getSelectedRange, 150);

    addHighlightEventListeners();
    const idx = getDaysSince();
    const curDate = getFormattedDate();
    let verseToGet = verses[idx];
    let customVerse = false;
    const dayOfWeek = idx % 7;

    if (idx.toString() != localStorage.getItem('day_idx')){
      localStorage.setItem('day_idx', idx.toString());
      localStorage.setItem('verse', '');
    }


    // If the user defined query params, use those instead to determine verse
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('book') && urlParams.has('chapter') && urlParams.has('verse')){
        customVerse = true;
        verseToGet = urlParams.get('book').replace(' ', '_')+' '+urlParams.get('chapter')+':'+urlParams.get('verse')
    }


    const bookUnderscore = verseToGet.split(' ')[0];
    const chapter_verse = verseToGet.split(' ')[1].split(':');
    const chapter = chapter_verse[0];
    const verseNumber = chapter_verse[1];

    document.getElementById("verse_title").textContent = verseToGet.replace('_', ' ');
    document.getElementById("verse_link").href = `https://www.churchofjesuschrist.org/study/scriptures/bofm/${abbrevs[bookUnderscore]}/${chapter}?lang=eng&id=p${verseNumber}#p${verseNumber}`

    updateText(`/verses/Book of Mormon/${bookUnderscore}/${chapter}/${verseNumber}.txt`)
    document.getElementById("date").textContent = curDate;

    // set background color
    if (customVerse){
        if (urlParams.has('color')){
            document.body.style.backgroundColor = urlParams.get('color');
        }
    }
    else {
        document.body.style.backgroundColor = colorOfDay[dayOfWeek];
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
'2_Nephi 31:13',
'Alma 5:46',
'Alma 37:33',
'1_Nephi 10:17',
'Moroni 10:4',
'Moroni 10:32',
'Ether 12:41',
'Mormon 3:21',
'Alma 13:10',
'Moroni 3:3',
'Moroni 6:4',
'Moroni 10:33',
'2_Nephi 25:19',
'Mosiah 3:12',
'Mormon 9:11',
'Alma 44:4',
'Moroni 4:3',
'Alma 5:54',
'Moroni 8:12',
'4_Nephi 1:1',
'Alma 37:40',
'Moroni 7:44',
'Jacob 4:11',
'Alma 9:21',
'Mormon 9:19',
'Alma 7:14',
'3_Nephi 9:20',
'Moroni 5:2',
'2_Nephi 26:12',
'Alma 11:44',
'Alma 34:38',
'Moroni 7:16',
'Moroni 7:25',
'Moroni 7:26',
'Alma 13:3',
'Alma 13:18',
'Moroni 10:8',
'2_Nephi 11:7',
'2_Nephi 30:5',
'Jacob 4:6',
'Alma 22:16',
'Ether 11:20',
'Ether 12:4',
'Alma 9:12',
'Alma 49:30',
'2_Nephi 25:26',
'Alma 30:44',
'Moroni 7:32',
'Alma 12:30',
'Jacob 7:19',
'3_Nephi 7:16',
'3_Nephi 28:23',
'1_Nephi 3:20',
'Alma 30:42',
'2_Nephi 32:3',
'Mosiah 7:27',
'Mormon 5:14',
'Mosiah 15:11',
'2_Nephi 21:2',
'Mosiah 4:2',
'Moroni 8:3',
'2_Nephi 30:2',
'2_Nephi 25:20',
'Alma 42:15',
'Mormon 9:13',
'Moroni 9:22',
'Alma 34:17',
'Alma 22:18',
'Alma 29:11',
'Alma 42:31',
'Mormon 7:8',
'2_Nephi 9:23',
'Mosiah 27:14',
'2_Nephi 25:16',
'2_Nephi 2:21',
'Jacob 4:13',
'Ether 12:7',
'Mosiah 7:19',
'Moroni 7:2',
'Alma 26:22',
'Alma 5:44',
'Alma 25:16',
'Mormon 9:29',
'Jarom 1:4',
'Alma 13:4',
'Alma 34:34',
'Mosiah 18:13',
'Alma 37:9',
'Ether 4:7',
'Alma 24:11',
'Mormon 9:22',
'Mosiah 25:22',
'Mosiah 4:3',
'Alma 43:10',
'Helaman 13:6',
'3_Nephi 4:30',
'Alma 5:50',
'2_Nephi 9:40',
'1_Nephi 11:6',
'Moroni 8:11',
'2_Nephi 31:21',
'Alma 31:16',
'Alma 42:22',
'Moroni 8:25',
'Mosiah 3:19',
'Alma 43:2',
'2_Nephi 28:32',
'Mosiah 3:21',
'Ether 12:20',
'1_Nephi 17:48',
'Alma 30:39',
'Mormon 9:12',
'Moroni 8:23',
'Mosiah 3:13',
'Mosiah 21:30',
'Alma 34:16',
'Moroni 8:28',
'Alma 8:10',
'2_Nephi 33:10',
'2_Nephi 4:35',
'Alma 27:27',
'Mormon 7:5',
'Mosiah 18:26',
'Alma 21:6',
'3_Nephi 7:21',
'Mormon 9:5',
'Moroni 8:8',
'Alma 58:40',
'Mosiah 4:11',
'1_Nephi 16:3',
'1_Nephi 20:1',
'Alma 29:2',
'3_Nephi 19:8',
'1_Nephi 22:2',
'Helaman 3:28',
'Alma 20:15',
'Alma 13:28',
'Alma 23:6',
'2_Nephi 11:4',
'Alma 37:30',
'Alma 36:17',
'Alma 45:10',
'Helaman 14:12',
'4_Nephi 1:38',
'Moroni 7:48',
'Alma 7:22',
'Alma 17:3',
'Alma 19:6',
'Alma 22:7',
'Alma 24:10',
'Words_of_Mormon 1:8',
'2_Nephi 9:15',
'Alma 36:5',
'2_Nephi 9:46',
'Alma 31:17',
'Alma 42:23',
'Alma 46:10',
'Words_of_Mormon 1:17',
'Moroni 9:26',
'Ether 12:12',
'Ether 12:10',
'1_Nephi 6:4',
'1_Nephi 13:30',
'2_Nephi 10:3',
'Alma 29:13',
'Jacob 7:14',
'Alma 44:3',
'Alma 61:15',
'Helaman 4:23',
'Helaman 8:25',
'Mosiah 16:5',
'2_Nephi 27:23',
'Alma 48:16',
'Alma 5:47',
'Alma 18:34',
'Moroni 8:10',
'2_Nephi 31:20',
'Words_of_Mormon 1:2',
'Alma 1:19',
'Ether 9:28',
'3_Nephi 29:7',
'Ether 12:22',
'Mosiah 12:30',
'Ether 3:12',
'Alma 32:21',
'1_Nephi 13:24',
'2_Nephi 16:3',
'2_Nephi 31:17',
'Moroni 8:22',
'2_Nephi 25:29',
'2_Nephi 2:10',
'Alma 30:48',
'Jacob 7:9',
'3_Nephi 5:26',
'Helaman 11:18',
'Moroni 7:39',
'Mormon 7:7',
'Ether 3:16',
'Alma 4:20',
'Moroni 7:13',
'Alma 13:12',
'Alma 13:1',
'Jacob 4:4',
'Enos 1:26',
'Mosiah 25:23',
'Alma 42:13',
'Alma 5:51',
'3_Nephi 9:15',
'Mosiah 13:4',
'Mormon 8:33',
'Alma 17:9',
'Alma 19:14',
'Moroni 8:15',
'2_Nephi 2:8',
'2_Nephi 9:18',
'Alma 37:15',
'Helaman 3:35',
'3_Nephi 5:13',
'3_Nephi 11:25',
'Moroni 7:22',
'Mosiah 15:26',
'Mormon 9:15',
'Alma 44:5',
'Alma 5:32',
'Alma 7:9',
'3_Nephi 16:10',
'1_Nephi 1:8',
'1_Nephi 13:34',
'1_Nephi 19:12',
'Jacob 1:8',
'Enos 1:8',
'Alma 36:24',
'Alma 42:4',
'3_Nephi 7:18',
'Mormon 9:3',
'Moroni 8:2',
'3_Nephi 4:32',
'Alma 19:27',
'Alma 5:15',
'Ether 8:23',
'3_Nephi 5:14',
'Ether 12:3',
'Moroni 10:21',
'Alma 17:4',
'Mosiah 3:8',
'Alma 36:6',
'Alma 22:14',
'3_Nephi 11:10',
'Mormon 5:16',
'2_Nephi 1:10',
'Mormon 9:10',
'Alma 5:24',
'Helaman 8:15',
'1_Nephi 17:35',
'Alma 7:15',
'1_Nephi 19:10',
'Alma 29:17',
'Alma 30:53',
'2_Nephi 9:2',
'4_Nephi 1:37',
'Mosiah 2:4',
'Mormon 8:38',
'Mosiah 11:23',
'Helaman 13:11',
'Alma 18:35',
'Alma 1:26',
'Moroni 8:9',
'Moroni 10:7',
'Mosiah 15:13',
'1_Nephi 15:33',
'2_Nephi 1:26',
'2_Nephi 9:13',
'Alma 38:6',
'2_Nephi 28:8',
'3_Nephi 30:1',
'Helaman 5:45',
'Alma 34:35',
'Ether 12:11',
'Alma 11:35',
'Alma 57:26',
'1_Nephi 11:25',
'Alma 13:8',
'Jacob 7:11',
'2_Nephi 9:24',
'Helaman 5:41',
'4_Nephi 1:29',
'Mosiah 2:41',
'Ether 2:12',
'Mosiah 28:2',
'Alma 48:15',
'Alma 7:16',
'Mormon 3:12',
'Alma 10:9',
'Alma 13:6',
'1_Nephi 12:18',
'3_Nephi 26:17',
'Moroni 6:9',
'Jacob 4:5',
'Alma 36:2',
'Mosiah 5:15',
'4_Nephi 1:34',
'2_Nephi 9:41',
'2_Nephi 10:24',
'Alma 15:10',
'2_Nephi 28:5',
'Alma 46:21',
'Jacob 4:14',
'Helaman 7:17',
'Ether 2:11',
'Alma 22:15',
'2_Nephi 31:14',
'Alma 5:48',
'Alma 42:30',
'3_Nephi 5:20',
'3_Nephi 20:31',
'Moroni 7:23',
'Moroni 7:38',
'Ether 12:19',
'2_Nephi 3:24',
'Ether 5:5',
'Alma 12:37',
'Alma 18:28',
'Words_of_Mormon 1:16',
'Enos 1:15',
'Alma 35:14',
'Mosiah 18:17',
'Alma 30:22',
'Alma 42:5',
'Alma 46:15',
'Alma 62:45',
'Helaman 5:11',
'Mosiah 13:3',
'3_Nephi 4:33',
'2_Nephi 31:19',
'Mosiah 17:19',
'Mosiah 25:24',
'Mormon 2:14',
'Mosiah 18:7',
'Mosiah 27:15',
'Alma 7:6',
'Ether 2:9',
'Alma 5:11',
'Moroni 8:19',
'Moroni 10:34',
'Alma 8:4',
'1_Nephi 5:4',
'Alma 5:52',
'Alma 22:9',
'1_Nephi 17:55',
'Moroni 8:14',
'Alma 31:27',
'Jacob 7:2',
'Mosiah 15:23',
'2_Nephi 9:52',
'2_Nephi 15:16',
'Alma 39:6',
'Alma 31:38',
'2_Nephi 28:26',
'Alma 49:27',
'3_Nephi 5:2',
'Alma 10:20',
'Jacob 2:35',
'3_Nephi 11:12',
'Alma 60:35',
'Helaman 3:30',
'Mormon 5:17',
'Mosiah 4:18',
'Helaman 8:12',
'Helaman 11:4',
'Moroni 7:19',
'Mosiah 15:22',
'3_Nephi 7:22',
'Mosiah 18:23',
'Enos 1:20',
'Mosiah 26:4',
'Alma 40:13',
'Mosiah 27:31',
'Alma 1:7',
'Helaman 9:16',
'Alma 7:8',
'3_Nephi 19:35',
'Ether 12:14',
'Moroni 7:34',
'Alma 12:32',
'2_Nephi 2:28',
'1_Nephi 11:31',
'Alma 18:16',
'Enos 1:10',
'1_Nephi 14:25',
'3_Nephi 11:32',
'Jacob 1:7',
'3_Nephi 19:30',
'Mosiah 5:7',
'3_Nephi 28:34',
'3_Nephi 19:3',
'Alma 14:26',
'Alma 42:3',
'3_Nephi 1:16',
'Helaman 7:23',
'Ether 4:3',
'Mosiah 11:25',
'3_Nephi 11:38',
'Jacob 4:15',
'Mosiah 4:30',
'Alma 19:25',
'Mormon 8:16',
'Mosiah 29:12',
'Alma 19:10',
'Alma 33:23',
'Moroni 8:16',
'Alma 57:27',
'Ether 3:19',
'Alma 11:24',
'Moroni 10:20',
'2_Nephi 9:48',
'2_Nephi 31:7',
'1_Nephi 13:12',
'Mosiah 18:19',
'1_Nephi 15:34',
'1_Nephi 17:52',
'3_Nephi 28:11',
'2_Nephi 25:24',
'Moroni 10:5',
'2_Nephi 1:27',
'Alma 31:22',
'Alma 4:14',
'1_Nephi 19:20',
'Alma 38:14',
'2_Nephi 26:32',
'Ether 11:1',
'Alma 46:41',
'2_Nephi 31:5',
'3_Nephi 11:2',
'Alma 60:33',
'Helaman 3:20',
'Mosiah 2:28',
'Mormon 9:21',
'Helaman 10:16',
'Moroni 7:17',
'Moroni 7:27',
'3_Nephi 6:18',
'Mosiah 18:18',
'3_Nephi 16:20',
'3_Nephi 28:30',
'Enos 1:16',
'Mosiah 25:15',
'Alma 30:46',
'Ether 3:20',
'Helaman 6:4',
'3_Nephi 19:28',
'Omni 1:25',
'Alma 9:26',
'1_Nephi 10:11',
'Moroni 7:28',
'Ether 4:18',
'1_Nephi 22:28',
'1_Nephi 14:14',
'3_Nephi 10:14',
'1_Nephi 17:30',
'Alma 24:18',
'Mosiah 21:35',
'2_Nephi 26:8',
'2_Nephi 2:13',
'2_Nephi 5:22',
'3_Nephi 19:25',
'2_Nephi 9:26',
'Alma 36:18',
'Mosiah 16:13',
'Alma 37:26',
'2_Nephi 27:5',
'Alma 30:6',
'Alma 34:37',
'2_Nephi 27:14',
'Alma 53:21',
'Alma 22:6',
'Jacob 3:8',
'3_Nephi 26:21',
'Helaman 14:19',
'Mormon 8:35',
'Mosiah 5:5',
'Moroni 4:1',
'Mosiah 11:22',
'Mosiah 13:33',
'Moroni 10:26',
'1_Nephi 11:19',
'3_Nephi 11:17',
'1_Nephi 1:20',
'2_Nephi 32:8',
'Mosiah 21:14',
'3_Nephi 22:6',
'Alma 3:26',
'Mosiah 24:22',
'Mosiah 4:6',
'Mosiah 27:9',
'Mormon 8:10',
'Alma 1:25',
'Alma 5:3',
'2_Nephi 9:44',
'Alma 30:52',
'Alma 10:17',
'1_Nephi 13:23',
'Alma 13:13',
'1_Nephi 10:21',
'Alma 34:30',
'1_Nephi 15:30',
'Alma 24:8',
'3_Nephi 27:20',
'1_Nephi 20:17',
'2_Nephi 3:5',
'2_Nephi 6:12',
'2_Nephi 9:11',
'2_Nephi 10:25',
'Alma 30:40',
'Alma 38:8',
'Alma 46:27',
'2_Nephi 31:11',
'2_Nephi 31:3',
'Alma 8:29',
'Jacob 6:4',
'Alma 60:25',
'Moroni 7:11',
'Mosiah 15:5',
'Mosiah 18:9',
'Mosiah 5:2',
'Mosiah 26:13',
'Mosiah 27:22',
'Mormon 9:4',
'Alma 3:14',
'Alma 5:18',
'Moroni 9:4',
'Alma 6:5',
'2_Nephi 33:1',
'1_Nephi 13:25',
'Alma 19:17',
'1_Nephi 14:12',
'3_Nephi 1:26',
'Alma 24:15',
'3_Nephi 19:13',
'3_Nephi 30:2',
'3_Nephi 7:10',
'2_Nephi 33:11',
'3_Nephi 27:2',
'Alma 39:9',
'Alma 27:28',
'2_Nephi 27:12',
'Alma 40:20',
'Helaman 5:12',
'Alma 50:39',
'Jacob 3:4',
'3_Nephi 21:11',
'Helaman 5:29',
'4_Nephi 1:27',
'Helaman 6:34',
'Moroni 2:3',
'Helaman 12:23',
'3_Nephi 3:25',
'3_Nephi 9:22',
'Alma 13:29',
'Moroni 10:9',
'Alma 7:13',
'2_Nephi 6:2',
'3_Nephi 27:19',
'Alma 8:30',
'Ether 12:18',
'Moroni 7:42',
'Alma 12:7',
'1_Nephi 5:13',
'1_Nephi 12:7',
'Alma 18:30',
'Mosiah 2:34',
'1_Nephi 13:40',
'3_Nephi 12:1',
'1_Nephi 17:47',
'1_Nephi 20:2',
'Alma 26:36',
'2_Nephi 30:7',
'3_Nephi 18:38',
'Mosiah 5:10',
'2_Nephi 9:39',
'Alma 30:26',
'Ether 7:25',
'2_Nephi 27:34',
'Alma 45:16',
'Alma 46:18',
'Helaman 16:4',
'Jacob 2:11',
'3_Nephi 28:40',
'Mormon 3:14',
'Mormon 9:8',
'Helaman 9:41',
'Helaman 13:33',
'Moroni 8:21',
'Mosiah 17:20',
'1_Nephi 12:10',
'Alma 11:22',
'Mosiah 18:20',
'Ether 2:10',
'Alma 34:15',
'Moroni 8:26',
'Ether 12:6',
'Ether 12:30',
'Alma 14:8',
'2_Nephi 32:2',
'1_Nephi 13:18',
'Alma 22:12',
'Helaman 8:16',
'1_Nephi 18:15',
'3_Nephi 29:2',
'Alma 29:9',
'2_Nephi 25:27',
'2_Nephi 33:7',
'Alma 31:28',
'Jacob 7:3',
'Alma 34:2',
'2_Nephi 28:28',
'2_Nephi 33:4',
'Alma 57:36',
'Helaman 4:15',
'Jacob 7:8',
'Helaman 3:33',
'3_Nephi 18:11',
'Mosiah 2:33',
'Moroni 7:33',
'Ether 3:14',
'2_Nephi 26:11',
'2_Nephi 3:21',
'4_Nephi 1:14',
'Alma 18:4',
'Mosiah 26:38',
'Ether 5:4',
'Alma 32:36',
'Alma 4:15',
'Moroni 7:37',
'Alma 11:43',
'Alma 12:33',
'1_Nephi 11:32',
'Alma 18:36',
'1_Nephi 15:15',
'Moroni 6:2',
'Ether 13:5',
'2_Nephi 2:17',
'2_Nephi 5:32',
'3_Nephi 20:9',
'Mosiah 5:8',
'4_Nephi 1:5',
'1_Nephi 1:4',
'2_Nephi 10:19',
'Alma 14:28',
'2_Nephi 26:16',
'Ether 7:23',
'Alma 46:14',
'Jacob 2:9',
'Enos 1:13',
'4_Nephi 1:48',
'Mosiah 3:22',
'Helaman 13:22',
'Jacob 3:1',
'Mormon 2:13',
'Mosiah 8:18',
'Moroni 8:18',
'Alma 58:11',
'Alma 7:23',
'Alma 38:1',
'Alma 11:25',
'1_Nephi 13:13',
'Alma 26:8',
'Alma 29:1',
'2_Nephi 25:25',
'Alma 30:43',
'Alma 31:23',
'Jacob 6:9',
'Mormon 3:19',
'2_Nephi 9:49',
'Alma 5:27',
'Helaman 15:11',
'2_Nephi 25:13',
'Alma 42:25',
'Alma 48:13',
'Alma 60:34',
'4_Nephi 1:17',
'Helaman 13:8',
'3_Nephi 12:19',
'Mosiah 4:14',
'Mosiah 8:16',
'Helaman 10:17',
'Moroni 7:31',
'3_Nephi 7:14',
'Helaman 3:29',
'2_Nephi 25:4',
'3_Nephi 19:18',
'Mosiah 24:5',
'Enos 1:18',
'Mormon 5:22',
'Alma 9:27',
'Moroni 7:6',
'Alma 7:5',
'Alma 8:20',
'Alma 9:30',
'Moroni 10:11',
'2_Nephi 2:6',
'Alma 15:17',
'2_Nephi 20:20',
'1_Nephi 11:27',
'1_Nephi 13:32',
'Alma 13:26',
'2_Nephi 10:7',
'3_Nephi 8:1',
'Jacob 1:6',
'Jacob 7:17',
'Alma 36:22',
'Alma 40:3',
'Alma 45:4',
'Jacob 2:7',
'Alma 54:6',
'Alma 23:15',
'Helaman 7:22',
'Alma 61:21',
'Helaman 12:2',
'2_Nephi 33:5',
'2_Nephi 33:3',
'Alma 3:27',
'Mosiah 25:10',
'Mosiah 4:21',
'Mosiah 27:10',
'Mormon 8:15']
