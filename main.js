
const verses = [
    'Mosiah 3:9',
    'Mosiah 3:10',
    'Mosiah 3:11',
]



const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2023, 9, 12);

function getDaysSince(){
    const secondDate = new Date();
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays
}

function getFormattedDate(){
    const d = new Date();
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
    const year = d.getFullYear();
    return month + ' ' + d.getDate() + ', ' + year;
}

function pageLoaded(){
    const idx = getDaysSince();
    const curDate = getFormattedDate();
    const verseToGet = verses[idx];


    updateText('/verses/Book of Mormon/1_Nephi/1/1.txt')
    document.getElementById("date").textContent = curDate;
    console.log(idx);
}

function verseTitleFromFile(file){
    return file.replace('_', ' ')
}

async function updateText(fileToGet) {
	let response = await fetch(fileToGet);
		
	if(response.status != 200) {
		throw new Error("Server Error");
	}
	let text_data = await response.text();
    document.getElementById("verse_title").textContent = verseTitleFromFile(fileToGet);
    document.getElementById("verse").textContent = text_data;
}