var quranHelper = {
    canvasElement: '#quranCanvas',
    currentSurah: 0,
    currentAyah: 0,
    currentAyahText: '',
    currentAyahTextUndiacritized: '',
    currentAyahIndex: 0,
    nextAcceptableKey: '',
    currentAyahIndexMap: {},

    suras: ['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'],
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


            var undiacritized = '';
            var li = -1;
            var diac = '';
            for (var i = 0; i < text.length; i++) {
                var c = text[i];
                if (diacritics.indexOf(c) >= 0){ 
                    diac += c;
                    continue;
                }


        
                if(c === 'ى'){
                    isLastCharAlef = true;
                }else {
                    isLastCharAlef = false;
        
                    if(c === 'ٰ')
                    {
                        continue;
                    }
                }


                if(li>=0){
                    this.currentAyahIndexMap[li] = diac;
                }

                diac = '';
        
                li++;
                undiacritized += c;
            }
        
            this.currentAyahIndex = undiacritized.length - 1;
            var ayahStr = ayah.toString().reverse();
            $(this.canvasElement).text(text);
            this.verifyInput();
            this.verifyInput(' ');
        } else {
            var ayahStr = ayah.toString().reverse();
            $(this.canvasElement).text(text + (!showAyahNumber ? '' : ' ' + (ayahStr.toArabicHindiNumerals())));

        }

        $('#currentSurahAyat').text('سورة ' + this.suras[surah-1] +  ' آية ' + ayah);

    },
    verifyInput: function (key) {
        if (key !== undefined && key !== null) {
            if (!charEquals(key, this.nextAcceptableKey)) return false;
            var arrayLength=  Object.keys(this.currentAyahIndexMap).length;
            var newText = $(this.canvasElement).html() + this.nextAcceptableKey + (this.currentAyahIndex === -1 || this.currentAyahIndex >= arrayLength? '' : this.currentAyahIndexMap[this.currentAyahIndex]);
            $(this.canvasElement).html(newText);
        }
        this.currentAyahIndex++;
        if (this.currentAyahIndex >= this.currentAyahTextUndiacritized.length) {
            var ayahStr = this.currentAyah.toString().reverse();
            $(this.canvasElement).append(' ' + ayahStr.toArabicHindiNumerals());
            var sa = this.nextAyahNumber();
            if (sa === null) return null;
            var text = this.getAyahText(sa.s, sa.a);

            this.currentAyahIndexMap = {};
            var undiacritized = '';
            var li = -1;
            var diac = '';
            for (var i = 0; i < text.length; i++) {
                var c = text[i];
                if (diacritics.indexOf(c) >= 0){ 
                    diac += c;
                    continue;
                }


        
                if(c === 'ى'){
                    isLastCharAlef = true;
                }else {
                    isLastCharAlef = false;
        
                    if(c === 'ٰ')
                    {
                        continue;
                    }
                }


                if(li>=0){
                    this.currentAyahIndexMap[li] = diac;
                }

                diac = '';
        
                li++;
                undiacritized += c;
            }
        

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