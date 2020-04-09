var quranHelper = {
    canvasElement: '#quranCanvas',

    currentSurah: 0,
    currentAyah: 0,
    currentAyahText: '',
    currentAyahTextUndiacritized: '',
    currentAyahIndex: 0,
    nextAcceptableKey: '',

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

    nextAyahNumber: function () {

        var surah = this.currentSurah;
        var ayah = this.currentAyah + 1;

        if (surah == 0)
            surah++;



        if (this.data[surah - 1].length <= ayah - 1) {
            surah++;

            if (surah === 115) return null;
            ayah = 1;

        }

        return {
            s: surah,
            a: ayah
        };
    },

    previousAyahNumber: function () {

        var surah = this.currentSurah;
        var ayah = this.currentAyah - 1;

        if (surah == 0)
            surah++;

        if (ayah < 1) {
            surah--;
            if (surah < 1) {
                return null;
            }

            ayah = this.data[surah - 1].length;
        }

        return {
            s: surah,
            a: ayah
        };
    },

    nextAyah: function () {

        var nextSa = this.nextAyahNumber();

        if (nextSa === null) return;

        this.goTo(nextSa.s, nextSa.a);
    },

    previousAyah: function () {

        var prevSa = this.previousAyahNumber();

        if (prevSa === null) return;

        this.goTo(prevSa.s, prevSa.a);
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

        this.currentSurah = surah;
        this.currentAyah = ayah;
        this.currentAyahText = text;
        this.currentAyahTextUndiacritized = text.removeDirecritics();

        var showAyahNumber = true;
        if (this.options.gameMode) {
            var text2 = text.firstWords(10);

            if (text2.length < text.length) {
                showAyahNumber = false;
            }

            text = text2;

            var undiacritized = text.removeDirecritics();

            this.currentAyahIndex = undiacritized.length - 1;

            this.verifyInput();
        }

        var ayahStr = ayah.toString().reverse();

        $(this.canvasElement).text(text + (!showAyahNumber ? '' : ' ' + (ayahStr.toArabicHindiNumerals())));



    },

    verifyInput: function (key) {

        if (key) {
            if (key !== this.nextAcceptableKey) return false;
        }

        var newText = $('#quranCanvas').html() + key;

        $(this.canvasElement).html(newText);

        this.currentAyahIndex++;

        if (this.currentAyahIndex >= this.currentAyahTextUndiacritized.length) {

            var ayahStr = this.currentAyah.toString().reverse();

            $(this.canvasElement).append(' ' + ayahStr.toArabicHindiNumerals());
            
            var sa = this.nextAyahNumber();

            if (sa === null) return null;

            var text = this.getAyahText(sa.s, sa.a);

            this.currentSurah = sa.s;
            this.currentAyah = sa.a;
            this.currentAyahIndex = -1;
            this.currentAyahText = text;
            this.currentAyahTextUndiacritized = text.removeDirecritics();

        }

        if (this.currentAyahIndex >= 0)
            this.nextAcceptableKey = this.currentAyahTextUndiacritized[this.currentAyahIndex];
        else
            this.nextAcceptableKey = ' ';


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

$(document).on('keydown', function (e) {

    if (e.ctrlKey || e.altKey) return;

    var val = $('#quranCanvas').text();

    var allow = true;

    var key = e.key.mapArabicKeys();
    if (arabicCharacters.indexOf(key) < 0 && diacritics.indexOf(key) < 0 && key !== ' ') {
        allow = false;
    }

    if (allow) {
        quranHelper.verifyInput(key);
    }
});


$('#quranCanvas').on('focus', function (e) {
    $(this).putCursorAtEnd();
});