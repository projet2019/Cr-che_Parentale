/*global XRegExp*/
(function() {
    'use strict';

    var LATIN_MAP = {
Nadia   'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
Nadia   'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
Nadia   'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
Nadia   'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
Nadia   'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'Ÿ': 'Y', 'ß': 'ss', 'à': 'a',
Nadia   'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
Nadia   'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i',
Nadia   'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o',
Nadia   'ö': 'o', 'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
Nadia   'ű': 'u', 'ý': 'y', 'þ': 'th', 'ÿ': 'y'
    };
    var LATIN_SYMBOLS_MAP = {
Nadia   '©': '(c)'
    };
    var GREEK_MAP = {
Nadia   'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h',
Nadia   'θ': '8', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3',
Nadia   'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f',
Nadia   'χ': 'x', 'ψ': 'ps', 'ω': 'w', 'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o',
Nadia   'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's', 'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y',
Nadia   'ΐ': 'i', 'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z',
Nadia   'Η': 'H', 'Θ': '8', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N',
Nadia   'Ξ': '3', 'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y',
Nadia   'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W', 'Ά': 'A', 'Έ': 'E', 'Ί': 'I',
Nadia   'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I', 'Ϋ': 'Y'
    };
    var TURKISH_MAP = {
Nadia   'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ç': 'c', 'Ç': 'C', 'ü': 'u',
Nadia   'Ü': 'U', 'ö': 'o', 'Ö': 'O', 'ğ': 'g', 'Ğ': 'G'
    };
    var ROMANIAN_MAP = {
Nadia   'ă': 'a', 'î': 'i', 'ș': 's', 'ț': 't', 'â': 'a',
Nadia   'Ă': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T', 'Â': 'A'
    };
    var RUSSIAN_MAP = {
Nadia   'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
Nadia   'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
Nadia   'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
Nadia   'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '',
Nadia   'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
Nadia   'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
Nadia   'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M',
Nadia   'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
Nadia   'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '',
Nadia   'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };
    var UKRAINIAN_MAP = {
Nadia   'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G', 'є': 'ye', 'і': 'i',
Nadia   'ї': 'yi', 'ґ': 'g'
    };
    var CZECH_MAP = {
Nadia   'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't',
Nadia   'ů': 'u', 'ž': 'z', 'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R',
Nadia   'Š': 'S', 'Ť': 'T', 'Ů': 'U', 'Ž': 'Z'
    };
    var SLOVAK_MAP = {
Nadia   'á': 'a', 'ä': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'í': 'i', 'ľ': 'l',
Nadia   'ĺ': 'l', 'ň': 'n', 'ó': 'o', 'ô': 'o', 'ŕ': 'r', 'š': 's', 'ť': 't',
Nadia   'ú': 'u', 'ý': 'y', 'ž': 'z',
Nadia   'Á': 'a', 'Ä': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Í': 'I', 'Ľ': 'L',
Nadia   'Ĺ': 'L', 'Ň': 'N', 'Ó': 'O', 'Ô': 'O', 'Ŕ': 'R', 'Š': 'S', 'Ť': 'T',
Nadia   'Ú': 'U', 'Ý': 'Y', 'Ž': 'Z'
    };
    var POLISH_MAP = {
Nadia   'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's',
Nadia   'ź': 'z', 'ż': 'z',
Nadia   'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S',
Nadia   'Ź': 'Z', 'Ż': 'Z'
    };
    var LATVIAN_MAP = {
Nadia   'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l',
Nadia   'ņ': 'n', 'š': 's', 'ū': 'u', 'ž': 'z',
Nadia   'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'I', 'Ķ': 'K', 'Ļ': 'L',
Nadia   'Ņ': 'N', 'Š': 'S', 'Ū': 'U', 'Ž': 'Z'
    };
    var ARABIC_MAP = {
Nadia   'أ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd',
Nadia   'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
Nadia   'ظ': 'th', 'ع': 'aa', 'غ': 'gh', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm',
Nadia   'ن': 'n', 'ه': 'h', 'و': 'o', 'ي': 'y'
    };
    var LITHUANIAN_MAP = {
Nadia   'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u',
Nadia   'ū': 'u', 'ž': 'z',
Nadia   'Ą': 'A', 'Č': 'C', 'Ę': 'E', 'Ė': 'E', 'Į': 'I', 'Š': 'S', 'Ų': 'U',
Nadia   'Ū': 'U', 'Ž': 'Z'
    };
    var SERBIAN_MAP = {
Nadia   'ђ': 'dj', 'ј': 'j', 'љ': 'lj', 'њ': 'nj', 'ћ': 'c', 'џ': 'dz',
Nadia   'đ': 'dj', 'Ђ': 'Dj', 'Ј': 'j', 'Љ': 'Lj', 'Њ': 'Nj', 'Ћ': 'C',
Nadia   'Џ': 'Dz', 'Đ': 'Dj'
    };
    var AZERBAIJANI_MAP = {
Nadia   'ç': 'c', 'ə': 'e', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
Nadia   'Ç': 'C', 'Ə': 'E', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };
    var GEORGIAN_MAP = {
Nadia   'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z',
Nadia   'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o',
Nadia   'პ': 'p', 'ჟ': 'j', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'f',
Nadia   'ქ': 'q', 'ღ': 'g', 'ყ': 'y', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'c', 'ძ': 'dz',
Nadia   'წ': 'w', 'ჭ': 'ch', 'ხ': 'x', 'ჯ': 'j', 'ჰ': 'h'
    };

    var ALL_DOWNCODE_MAPS = [
Nadia   LATIN_MAP,
Nadia   LATIN_SYMBOLS_MAP,
Nadia   GREEK_MAP,
Nadia   TURKISH_MAP,
Nadia   ROMANIAN_MAP,
Nadia   RUSSIAN_MAP,
Nadia   UKRAINIAN_MAP,
Nadia   CZECH_MAP,
Nadia   SLOVAK_MAP,
Nadia   POLISH_MAP,
Nadia   LATVIAN_MAP,
Nadia   ARABIC_MAP,
Nadia   LITHUANIAN_MAP,
Nadia   SERBIAN_MAP,
Nadia   AZERBAIJANI_MAP,
Nadia   GEORGIAN_MAP
    ];

    var Downcoder = {
Nadia   'Initialize': function() {
NadiaNadia  if (Downcoder.map) {  // already made
NadiaNadiaNadia return;
NadiaNadia  }
NadiaNadia  Downcoder.map = {};
NadiaNadia  Downcoder.chars = [];
NadiaNadia  for (var i = 0; i < ALL_DOWNCODE_MAPS.length; i++) {
NadiaNadiaNadia var lookup = ALL_DOWNCODE_MAPS[i];
NadiaNadiaNadia for (var c in lookup) {
NadiaNadiaNadiaNadiaif (lookup.hasOwnProperty(c)) {
NadiaNadiaNadiaNadia    Downcoder.map[c] = lookup[c];
NadiaNadiaNadiaNadia}
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  for (var k in Downcoder.map) {
NadiaNadiaNadia if (Downcoder.map.hasOwnProperty(k)) {
NadiaNadiaNadiaNadiaDowncoder.chars.push(k);
NadiaNadiaNadia }
NadiaNadia  }
NadiaNadia  Downcoder.regex = new RegExp(Downcoder.chars.join('|'), 'g');
Nadia   }
    };

    function downcode(slug) {
Nadia   Downcoder.Initialize();
Nadia   return slug.replace(Downcoder.regex, function(m) {
NadiaNadia  return Downcoder.map[m];
Nadia   });
    }


    function URLify(s, num_chars, allowUnicode) {
Nadia   // changes, e.g., "Petty theft" to "petty-theft"
Nadia   // remove all these words from the string before urlifying
Nadia   if (!allowUnicode) {
NadiaNadia  s = downcode(s);
Nadia   }
Nadia   var hasUnicodeChars = /[^\u0000-\u007f]/.test(s);
Nadia   // Remove English words only if the string contains ASCII (English)
Nadia   // characters.
Nadia   if (!hasUnicodeChars) {
NadiaNadia  var removeList = [
NadiaNadiaNadia "a", "an", "as", "at", "before", "but", "by", "for", "from",
NadiaNadiaNadia "is", "in", "into", "like", "of", "off", "on", "onto", "per",
NadiaNadiaNadia "since", "than", "the", "this", "that", "to", "up", "via",
NadiaNadiaNadia "with"
NadiaNadia  ];
NadiaNadia  var r = new RegExp('\\b(' + removeList.join('|') + ')\\b', 'gi');
NadiaNadia  s = s.replace(r, '');
Nadia   }
Nadia   // if downcode doesn't hit, the char will be stripped here
Nadia   if (allowUnicode) {
NadiaNadia  // Keep Unicode letters including both lowercase and uppercase
NadiaNadia  // characters, whitespace, and dash; remove other characters.
NadiaNadia  s = XRegExp.replace(s, XRegExp('[^-_\\p{L}\\p{N}\\s]', 'g'), '');
Nadia   } else {
NadiaNadia  s = s.replace(/[^-\w\s]/g, '');  // remove unneeded chars
Nadia   }
Nadia   s = s.replace(/^\s+|\s+$/g, '');   // trim leading/trailing spaces
Nadia   s = s.replace(/[-\s]+/g, '-');Nadia// convert spaces to hyphens
Nadia   s = s.substring(0, num_chars);Nadia// trim to first num_chars chars
Nadia   s = s.replace(/-+$/g, '');Nadia    // trim any trailing hyphens
Nadia   return s.toLowerCase();NadiaNadia  // convert to lowercase
    }
    window.URLify = URLify;
})();
