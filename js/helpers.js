var arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
var diacritics = ['ّ', 'َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ـ', 'ۥ', 'ۦ'];
var arabicCharacters = ['ء', 'ا', 'أ', 'إ', 'آ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ة', 'و', 'ؤ', 'ي', 'ى', 'ٰ'];
var englishCharactersSmall = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var englishCharactersCapital = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var arabicKeyMap = {
    '`': 'ذ',
    'q': 'ض',
    'w': 'ص',
    'e': 'ث',
    'r': 'ق',
    't': 'ف',
    'y': 'غ',
    'u': 'ع',
    'i': 'ه',
    'o': 'خ',
    'p': 'ح',
    '[': 'ج',
    ']': 'د',
    'a': 'ش',
    's': 'س',
    'd': 'ي',
    'f': 'ب',
    'g': 'ل',
    'h': 'ا',
    'j': 'ت',
    'k': 'ن',
    'l': 'م',
    ';': 'ك',
    '\'': 'ط',
    'z': 'ئ',
    'x': 'ء',
    'c': 'ؤ',
    'v': 'ر',
    'b': 'لا',
    'n': 'ى',
    'm': 'ة',
    ',': 'و',
    '.': 'ز',
    '/': 'ظ',
    '~': 'ّ',
    'Q': 'َ',
    'W': 'ً',
    'E': 'ُ',
    'R': 'ٌ',
    'T': 'لإ',
    'Y': 'إ',
    'U': '‘',
    'A': 'ِ',
    'S': 'ٍ',
    'G': 'لأ',
    'H': 'أ',
    'J': 'ـ',
    'Z': '~',
    'X': 'ْ',
    'B': 'لآ',
    'N': 'آ'
};

String.prototype.normalize = function () {

    var newStr = '';
    for (var i = 0; i < this.length; i++) {
        var c = this[i];
        if (diacritics.indexOf(c) >= 0) continue;

        if (['ا', 'أ', '~', 'آ', 'إ', 'ٰ', 'ء', 'ئ', 'ؤ'].indexOf(c) >= 0) {
            c = 'ا';
        } else if (['ي', 'ى'].indexOf(c) >= 0) {
            c = 'ى';
        } else if (['ة', 'ه'].indexOf(c) >= 0) {
            c = 'ه';
        }
        newStr += c;
    }

    return newStr;

};

String.prototype.removeDirecritics = function () {

    var isLastCharAlef = false;
    var newStr = '';
    for (var i = 0; i < this.length; i++) {
        var c = this[i];
        if (diacritics.indexOf(c) >= 0) continue;

        if (c === 'ى') {
            isLastCharAlef = true;
        } else {
            isLastCharAlef = false;

            if (c === 'ٰ') {
                continue;
            }
        }

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
    var w = '';
    var isArabic = false;
    var wordCount = 0;

    for (var i = 0; i < this.length; i++) {
        var c = this.charAt(i);

        if (arabicCharacters.indexOf(c) >= 0 || diacritics.indexOf(c) >= 0) {

            if (!isArabic) {
                if (w.length > 0) {
                    wordCount++;
                    if (wordCount == count) {
                        break;
                    }
                    w = '';
                }

                isArabic = true;
            }

            w += c;


        } else if (englishCharactersCapital.indexOf(c) >= 0 || englishCharactersSmall.indexOf(c) >= 0) {

            if (isArabic) {
                if (w.length > 0) {
                    wordCount++;
                    if (wordCount == count) {
                        break;
                    }
                    w = '';
                }

                isArabic = false;
            }

            w += c;


        } else {

            if (w.length > 0) {
                wordCount++;
                if (wordCount == count) {
                    break;
                }
                w = '';
            }
        }

    }

    return this.substring(0, i);

};


String.prototype.reverse = function () {
    var newStr = '';

    for (var i = this.length - 1; i >= 0; i--) {
        newStr += this[i];
    }

    return newStr;
};


String.prototype.mapArabicKeys = function () {
    var newStr = '';
    for (var i = 0; i < this.length; i++) {
        if (arabicCharacters.indexOf(this[i]) >= 0 || diacritics.indexOf(this[i]) >= 0) {
            newStr += this[i];
        } else if (arabicKeyMap[this[i]] !== undefined) {
            newStr += arabicKeyMap[this[i]];

        } else {
            newStr += this[i];
        }

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

var charEquals = function (c1, c2) {
    if (!c1 || !c2) return false;

    if (c1 === c2) return true;

    c1 = c1.normalize();
    c2 = c2.normalize();

    return c1 === c2;

};

// source: https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function () {

    return this.each(function () {

        // Cache references
        var $el = $(this),
            el = this;

        // Only focus if input isn't already
        if (!$el.is(":focus")) {
            $el.focus();
        }

        // If this function exists... (IE 9+)
        if (el.setSelectionRange) {

            // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
            var len = $el.val().length * 2;

            // Timeout seems to be required for Blink
            setTimeout(function () {
                el.setSelectionRange(len, len);
            }, 1);

        } else {

            // As a fallback, replace the contents with itself
            // Doesn't work in Chrome, but Chrome supports setSelectionRange
            $el.val($el.val());

        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Chrome)
        this.scrollTop = 999999;

    });

};