var arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
var diacritics = ['ّ', 'َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ـ', 'ٰ'];
var arabicCharacters = ['ء', 'ا', 'أ', 'إ', 'آ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ة', 'و', 'ؤ', 'ي', 'ى'];
var englishCharactersSmall = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var englishCharactersCapital = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

String.prototype.removeDirecritics = function () {

    var newStr = '';
    for (var i = 0; i < this.length; i++) {
        var c = this[i];
        if (diacritics.indexOf(c) >= 0) continue;
        newStr += c;
    }

    return newStr;

};


String.prototype.getWords = function () {
    var words = [];
    var w = '';
    var isArabic = false;

    for (var i = 0; i < this.length; i++) {
        var c = this.charAt(i);

        if (arabicCharacters.indexOf(c) >= 0 || diacritics.indexOf(c) >= 0) {

            if (!isArabic) {
                if (w.length > 0) {
                    words.push(w);
                    w = '';
                }

                isArabic = true;
            }

            w += c;


        } else if (englishCharactersCapital.indexOf(c) >= 0 || englishCharactersSmall.indexOf(c) >= 0) {

            if (isArabic) {
                if (w.length > 0) {
                    words.push(w);
                    w = '';
                }

                isArabic = false;
            }

            w += c;


        } else {

            if (w.length > 0) {
                words.push(w);
                w = '';
            }
        }

    }

    if (w.length > 0)
        words.push(w);

    return words;

};

String.prototype.wordCount = function () {
    return this.getWords().length;
};

String.prototype.firstWords = function (count) {
    var words = this.getWords();

    if (count < words)
        return words;

    return words.slice(0, count);

};


String.prototype.reverse = function () {
    var newStr = '';

    for (var i = this.length - 1; i >= 0; i--) {
        newStr += this[i];
    }

    return newStr;
};


String.prototype.toArabicHindiNumerals = function () {
    var val = '';
    for (var i = 0; i < this.length; i++) {
        var num = parseInt(this[i]);

        if (isNaN(num)) {
            val += this[i];
        } else {
            val += arabicNumerals[num];
        }
    }

    return val;
};

Number.prototype.toArabicHindiNumerals = function () {
    var val = '';

    var str = this.toString();

    return str.toArabicHindiNumerals();
};

var quranHelper = {
    canvasElement: '#quranCanvas',

    currentSurah: 0,
    currentAyah: 0,

    options: {
        gameMode: true,
        minWordsInGame: 10
    },


    data: [],

    ayat: [],

    load: function () {
        var that = this;
        $.get('/data/quran-uthmani-min.txt')
            .done(function (res) {

                var data = [];
                var ayat = [];

                var lines = res.split('\n');

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line.indexOf('#') === 0) continue; // comment

                    var tabs = line.split('|');
                    if (tabs.length != 3) continue; // must have 3 tabs only

                    var surah = parseInt(tabs[0]);
                    var ayah = parseInt(tabs[1]);
                    var text = tabs[2];

                    if (isNaN(surah) || isNaN(ayah)) continue; // must be integers

                    ayat.push({
                        s: surah,
                        a: ayah,
                        text: text
                    });

                    if (data.length < surah) {
                        data.push([]);
                    }

                    data[surah - 1][ayah - 1] = text;

                }

                that.data = data;
                that.ayat = ayat;

                if (that.options.gameMode) {

                    var rand = Math.floor(Math.random() * ayat.length);
                    var sa = ayat[rand];
                    that.goTo(sa.s, sa.a);
                } else {
                    that.nextAyah();
                }


            });
    },

    nextSurah: function () {

        var surah = this.currentSurah;

        if (surah == 0)
            surah++;

        surah++;



        if (this.data.length <= surah - 1) {
            return;
        }

        this.goTo(surah, 1);
    },


    previousSurah: function () {

        var surah = this.currentSurah;

        if (surah == 0)
            surah++;

        surah--;



        if (surah < 1) {
            return;
        }

        this.goTo(surah, 1);
    },


    nextAyah: function () {

        var surah = this.currentSurah;
        var ayah = this.currentAyah + 1;

        if (surah == 0)
            surah++;



        if (this.data[surah - 1].length <= ayah - 1) {
            surah++;

            if (surah === 115) return;
            ayah = 1;

        }

        this.goTo(surah, ayah);
    },

    previousAyah: function () {

        var surah = this.currentSurah;
        var ayah = this.currentAyah - 1;

        if (surah == 0)
            surah++;

        if (ayah < 1) {
            surah--;
            if (surah < 1) {
                return;
            }

            ayah = this.data[surah - 1].length;
        }

        this.goTo(surah, ayah);
    },

    getAyahText: function (surah, ayah) {
        if (isNaN(surah) || isNaN(ayah)) return null; // must be integers

        if (this.data.length > surah - 1 && this.data[surah - 1].length > ayah - 1) {

            var text = this.data[surah - 1][ayah - 1];
            if (ayah === 1 && text.indexOf(this.data[0][0]) === 0 && surah !== 1) {
                text = text.substring(this.data[0][0].length).trim();
            }

            return text;
        }

        return null;
    },
    goTo: function (surah, ayah) {
        var text = this.getAyahText(surah, ayah);

        if (false && this.options.gameMode) {

            var wordCount = text.wordCount();

            if (wordCount > this.options.minWordsInGame) {

            } else {

            }


        } else {

            var ayahStr = ayah.toString().reverse();

            $(this.canvasElement).text(text + ' ' + (ayahStr.toArabicHindiNumerals()));

            this.currentSurah = surah;
            this.currentAyah = ayah;
        }

    }
};


$(document).keydown(function (e) {
    switch (e.which) {
        case 37: // left
            quranHelper.nextAyah();
            break;

        case 39: // right
            quranHelper.previousAyah();
            break;

        case 38: // up
            quranHelper.previousSurah();
            break;

        case 40: // down
            quranHelper.nextSurah();
            break;

        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

quranHelper.load();