String.prototype.removeDirecritics = function () {
    var diacritics = ['ّ', 'َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ـ', 'ٰ'];
    var newStr = '';
    for (var i = 0; i < this.length; i++) {
        var c = this[i];
        if (diacritics.indexOf(c) >= 0) continue;
        newStr += c;
    }

    return newStr;

};



var quranHelper = {
    canvasElement: '#quranCanvas',

    currentSurah: 0,
    currentAyah: 0,

    data: [],

    load: function () {
        var that = this;
        $.get('/data/quran-uthmani-min.txt')
            .done(function (res) {

                var data = [];

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


                    if (data.length < surah) {
                        data.push([]);
                    }

                    data[surah - 1][ayah - 1] = text;

                }

                that.data = data;

                that.nextAyah();


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

    goTo: function (surah, ayah) {
        if (isNaN(surah) || isNaN(ayah)) return; // must be integers

        if (this.data.length > surah - 1 && this.data[surah - 1].length > ayah - 1) {

            var text = this.data[surah - 1][ayah - 1];
            if (ayah === 1 && text.indexOf(this.data[0][0]) === 0 && surah !== 1) {
                text = text.substring(this.data[0][0].length).trim();
            }

            $(this.canvasElement).text(text + ' ' + (ayah));

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