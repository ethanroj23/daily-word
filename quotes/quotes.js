
// function quotesOnload(){
//     console.log(quotes);
// }


function quotesOnload(){
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
    const verse = chapter_verse[1];

    document.getElementById("verse_title").textContent = verseToGet.replace('_', ' ');
    document.getElementById("verse_link").href = `https://www.churchofjesuschrist.org/study/scriptures/bofm/${abbrevs[bookUnderscore]}/${chapter}?lang=eng&id=p${verse}#p${verse}`

    updateText(`/verses/Book of Mormon/${bookUnderscore}/${chapter}/${verse}.txt`)
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


quotes = {"Elder David A. Bednar": "I promise your personal anguish will be relieved and your obedience and faithfulness to patiently submit your will to God will be rewarded in the own due time of the Lord.",

"Sister Amy A. Wright": "In the end, because of Jesus Christ, everything can be okay.",

"Elder Robert M. Davies": "We want to see Jesus for who He is and to feel His love. This should be the reason for most of what we do in the Church.",

"Elder Carlos A. Godoy": "As we know, anything broken can be mended through Jesus Christ. Will our current decisions lead us to joy now and in eternity, or will they lead us to sorrow and tears?",

"Elder Ian S. Ardern": "Each of us can be the one who can make a difference for good in the life of someone. It is unlikely you will know the recipients of your time, dollars, and dimes, but compassion does not require us to know them, it only requires us to love them.",

"President Dallin H. Oaks": "We have a loving Heavenly Father who will see that we receive every blessing and every advantage that our own desires and choices allow.",

"Elder D. Todd Christofferson": "The sealing power makes individual salvation and family exaltation universally available to the children of God, wherever and whenever they may have lived on the earth.",

"Elder Neil L. Andersen": "Trust in the Lord’s timing; the blessings always come.",

"Elder Jan E. Newman": "We can ensure that the voice of the covenant people is not silent in the ears of the rising generation and that Jesus is not a Sunday-only topic.",

"Elder Joaquin E. Costa": "Sometimes we may think, ‘I need to fix my life before I come to Jesus,’  but the truth is we come to Jesus to fix our life.",

"Elder Gary E. Stevenson": "Many of you start your day by standing in front of a mirror. Tomorrow, this week, this year, always pause. As you look at yourself in the mirror, think to yourself, or say aloud if you like, \"Wow, look at me. I'm amazing. I'm a Child of God.\" He knows me. He loves me.",

"Elder Yoon Hwan Choi": "He sees our needs. He provides the strength we need, and has blessings ready to be poured out upon us as we faithfully serve.",

"Elder Alan T. Phillips": "You are not an accidental byproduct of nature, a cosmic orphan, or the result of matter plus time plus change. Where there is design, there is a designer.",

"Elder Ronald A. Rasband": "As an apostle of the Lord Jesus Christ, I ask you to serve as a missionary in the Gathering of Israel, and perhaps even serve again. We need you. We need you.",

"Elder Gary B. Sabin": "We can’t move with the crowd and also toward Jesus. The Savior has defeated death, disease, and sin, and has provided a way for our ultimate perfection if we follow Him with all of our hearts.",

"Elder Joni L. Koch": "It’s so important to make and keep covenants with God, as doing so will give us full access to the healing, enabling, and perfecting power of Jesus Christ through His Atonement.",

"Sister Tamara W. Runia": "No home is a failure unless it quits trying. Surely those who love the most and longest win.",

"Elder Ulisses Soares": "The light of a new day shines brighter in our lives when we see and treat our fellow beings with respect and dignity as true brothers and sisters in Christ.",

"President M. Russell Ballard": "I know that Jesus Christ is the Savior and the Redeemer of the World. He is our best friend.",

"Sister Emily Belle Freeman ": "A covenant is not only about a contract, although that is important. It’s about a relationship. Jesus will meet us where we are, as we are.",

"Elder Adilson de Paula Parella": "As we strive to live our lives in harmony with the gospel of Jesus Christ, our conduct will be a living testimony of our Redeemer and His name.",

"Elder Quentin L. Cook": "For those of us in the Church striving to be \"peaceable followers of Christ,\" a brighter day awaits us as we focus on our Lord and Savior, Jesus Christ.",

"Bishop W. Christopher Waddell": "The hero, our hero, now and always, is Jesus Christ, and anything or anyone, that distracts us from His teachings can negatively impact our progress on the covenant path.",

"Elder Dieter F. Ucthdorf. ": "Our Heavenly Father will run to us, His heart overflowing with love and compassion. Heaven will rejoice at our return.",

"President Henry B. Eyring": "If you want to receive the companionship of the Holy Ghost, you must want it for the right reasons. Your purposes must be the Lord’s purposes.",

"Elder Dale G. Renlund": "Jesus Christ is our treasure. The Savior has given us many ways to focus on Him intentionally, including the daily opportunity to repent.",

"Elder John C. Pingree Jr. ": "Both truth and love are essential for our spiritual development.",

"Elder Valeri V. Cordón": "Jesus Christ is the center of this gospel culture. Adopting the gospel culture in our families is critical to creating a fertile environment where the seed of faith may flourish.",

"Elder J. Kimo Esplin": "Through temple blessings, the Savior heals individuals, families, and nations—even those that once stood as bitter enemies.",

"Elder Gerrit W. Gong": "Sometimes we need to know love is spoken here, is heard and appreciated here.",

"Elder Christopher G. Giraud-Carrier": "The gospel of Jesus Christ ‘is the great equalizer.’ When truly embraced, one comes to know that each person is a child of God.",

"President Russell M. Nelson": "As you ‘think celestial,’ you will view trials and opposition in a new light.",
}