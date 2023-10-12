
const verses = [
    ['Mosiah 3:9', 'And lo, he cometh unto his own, that salvation might come unto the children of men even through faith on his name; and even after all this they shall consider him a man, and say that he hath a devil, and shall scourge him, and shall crucify him.'],
    ['verse title2', 'verse content'],
    ['verse title3', 'verse content'],
    ['verse title4', 'verse content'],
    ['verse title5', 'verse content'],
    ['verse title6', 'verse content'],
    ['verse title7', 'verse content'],
    ['verse title8', 'verse content'],
]

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2023, 9, 12);

function getDaysSince(){
    const secondDate = new Date();
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    return diffDays
}



function pageLoaded(){
    const idx = getDaysSince();
    document.getElementById("verse_title").textContent = verses[idx][0];
    document.getElementById("verse").textContent = verses[idx][1];
    console.log(idx);
}