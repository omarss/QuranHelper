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

window.isMobileOrTablet = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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