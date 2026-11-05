const deckData = [
  // ==========================================
  // DECK 1
  // ==========================================
  {
    "id": "deck-1",
    "name": "Phrases du quotidien",
    "defaultDate": "04/11/2026",
    "cards": [
      {
        "id": "1-1", 
        "type": "trad", 
        "front": "Every boy dreams of sex on the beach.",
        "it": "Ogni ragazzo sogna di fare sesso sulla spiaggia.",
        "sv": "Varje pojke drömmer om sex på stranden. ;; tr: vár-ye póy-ke drǿm-mer om seks po strán-den",
        "ar": "كل صبي يحلم بالجنس على الشاطئ",
        "es": "Todo chico sueña con tener sexo en la playa.",
        "ja": "すべての少年はビーチでのセックスに憧れる。"
      },       
      {
        "id": "1-2", "type": "voc-it", 
        "front": "Sognare",
        "answer": "To dream",
        "detect": "sogna, sognare, sognato",
        "detect-off": "sogn"
      },
      {
        "id": "1-3", "type": "voc-it", 
        "front": "Fare",
        "answer": "To do / To make",
        "detect": "fare, fatto",
        "detect-off": "fa"
      },
      {
        "id": "1-4", "type": "voc-it", 
        "front": "Spiaggia",
        "answer": "Beach",
        "detect-all": "spiagg"
      },
      {
        "id": "1-5", "type": "voc-es", 
        "front": "Soñar",
        "answer": "To dream",
        "detect": "sueña, soñar, soñó",
        "detect-all": "soñ, sueñ"
      },
      {
        "id": "1-6", "type": "voc-es", 
        "front": "Tener",
        "answer": "To have",
        "detect": "tiene, tener, tuvo",
        "detect-off": "ten, tuv"
      },
      {
        "id": "1-7", "type": "voc-sv", 
        "front": "Drömma",
        "answer": "To dream ;; nt: grupp 1 ;; tr: drǿm-ma",
        "detect": "drömmer, drömde, drömt",
        "detect-all": "drøm"
      },
      {
        "id": "1-8", "type": "voc-sv", 
        "front": "Strand",
        "answer": "Beach ;; tr: strand",
        "detect": "strand, stranden, stränder",
        "detect-all": "strand"
      },
      {
        "id": "1-9", "type": "voc-sv", 
        "front": "Pojke",
        "answer": "Boy ;; tr: póy-ke",
        "detect": "pojke, pojken, pojkar",
        "detect-all": "pojk"
      }, 
      {
        "id": "1-10", 
        "type": "trad", 
        "front": "Show me how you did it, I'm curious.",
        "it": "Fammi vedere come l'hai fatto, sono curioso.",
        "sv": "Visa mig hur du gjorde det, jag är nyfiken. ;; tr: víː-sa mey hüːr dü yóːr-de de, yag éːr nǘː-fi-ken",
        "ar": "أرني كيف فعلت ذلك، أنا فضولي",
        "es": "Muéstrame cómo lo hiciste, tengo curiosidad.",
        "ja": "どうやったか見せてよ、気になるんだ。"
      },
            {
        "id": "1-11", "type": "voc-sv", 
        "front": "Nyfiken",
        "answer": "Curious ;; nt: adjective ;; tr: nǘː-fi-ken",
        "detect": "nyfiken, nyfikna, nyfiket",
        "detect-all": "nyfik"
      },
      {
        "id": "1-12", "type": "voc-sv", 
        "front": "Göra",
        "answer": "To do / To make ;; nt: grupp 4 ;; tr: yǿː-ra",
        "detect": "göra, gjorde, gjort, gör",
        "detect-all": "gör"
      },
      {
        "id": "1-13", "type": "voc-ja", 
        "front": "気になる",
        "answer": "To be curious / To be on one's mind",
        "detect": "気になる, 気になった",
        "detect-all": "気になる"
      },
      {
        "id": "1-14", "type": "voc-ar", 
        "front": "فضولي",
        "answer": "Curious",
        "detect": "فضولي",
        "detect-all": "فضول"
      }, 
      {
        "id": "1-17", "type": "voc-ja", 
        "front": "憧れる",
        "answer": "To long for / To aspire to ;; nt: 一段動詞 ;; tr: あこがれる",
        "detect": "憧れる, 憧れて, 憧れた, 憧れます",
        "detect-all": "憧れ"
      },
            {
        "id": "1-18", 
        "type": "trad", 
        "front": "Well, we worked really well today, huh!",
        "it": "Beh, oggi abbiamo lavorato proprio bene, eh!",
        "sv": "Ja, vi har verkligen jobbat bra idag, eller hur? ;; tr: ya, vi har vérk-li-gen yób-bat bra i-dág, él-ler hür",
        "ar": "حسناً، لقد عملنا بشكل جيد اليوم، أليس كذلك؟",
        "es": "Bueno, hoy hemos trabajado muy bien, ¿eh?",
        "ja": "いやあ、今日はよく頑張ったね！"
      },
      {
        "id": "1-19", "type": "voc-sv", 
        "front": "Verkligen",
        "answer": "Really / Truly ;; nt: adverb ;; tr: vérk-li-gen",
        "detect": "verkligen"
      },
      {
        "id": "1-20", "type": "voc-sv", 
        "front": "Eller",
        "answer": "Or ;; nt: conjunction ;; tr: él-ler",
        "detect": "eller"
      }
    ]
  },
  // ==========================================
  // DECK 2
  // ==========================================
  {
    "id": "deck-2",
    "name": "From Quizlet",
    "defaultDate": "04/11/2026",
    "cards": [
      {
        "id": "2-1", 
        "type": "trad", 
        "front": "I closed the door, but the wind opened it again.",
        "sv": "Jag stängde dörren, men vinden öppnade den igen. ;; tr: yag sténg-de dǿr-ren, men vín-den ǿp-na-de den i-yén."
      },
      {
        "id": "2-2", 
        "type": "voc-sv", 
        "front": "Stänga",
        "answer": "To close;; tr: sténga",
        "detect": "stänga, stängde",
        "detect-all": "stäng"
      },
      {
        "id": "2-3", 
        "type": "trad", 
        "front": "I followed the sound of the phone when it rang.",
        "sv": "Jag följde ljudet från telefonen när den ringde. ;; tr: yag fǿl-de yǘː-det fron te-le-fóː-nen nèːr den ríng-de"
      },
      {
        "id": "2-4", 
        "type": "voc-sv", 
        "front": "Följa",
        "answer": "To follow ;; tr: fǿl-ya",
        "detect-all": "följ"
      }, 
      {
        "id": "2-5", 
        "type": "trad", 
        "front": "I wrote a letter and read it several times until I fell asleep. I sent it only the following day, when I finally woke up.",
        "sv": "Jag skrev ett brev och läste det flera gånger tills jag somnade. Jag skickade det först dagen därpå, när jag äntligen vaknade. ;; tr: yag skrev et brev o lés-te de flé-ra góng-er tils yag sóm-na-de. yag şík-ka-de de først dá-gen där-po, när yag ént-li-gen vák-na-de"
      },
      {
        "id": "2-6", "type": "voc-sv", 
        "front": "Skriva",
        "answer": "To write ;; tr: skríː-va",
        "detect-all": "skriv, skrev"
      },
      {
        "id": "2-7", "type": "voc-sv", 
        "front": "Läsa",
        "answer": "To read ;; tr: léː-sa",
        "detect": "läsa, läste, läst",
        "detect-off": "läs"
      },
      {
        "id": "2-8", "type": "voc-sv", 
        "front": "Somna",
        "answer": "To fall asleep ;; tr: sóm-na",
        "detect": "somna, somnade, somnat"
      },
      {
        "id": "2-9", "type": "voc-sv", 
        "front": "Skicka",
        "answer": "To send ;; tr: şík-ka",
        "detect": "skicka, skickade, skickat"
      },
      {
        "id": "2-10", "type": "voc-sv", 
        "front": "Vakna",
        "answer": "To wake up ;; tr: vák-na",
        "detect-all": "vakn"
      },
      {
        "id": "2-11", "type": "gr-sv", 
        "front": "Règle du passé (-de vs -te) et verbe irrégulier.",
        "answer": "Si le radical se termine par k, p, s, ou t, on ajoute -te au lieu de -de. ;; nt: Exemple : läsa -> läste. Exception : skriva est irrégulier (skrev)."
      },
      {
        "id": "2-12", "type": "voc-sv", 
        "front": "Ringa",
        "answer": "To ring ;; tr: ríng-a",
        
        "detect": "ringa, ringde, ringt",
      },
      {
        "id": "2-13", 
        "type": "voc-sv", 
        "front": "När",
        "answer": "When ;; tr: nèːr",
        "detect": "när",
      },
      {
        "id": "2-14", 
        "type": "voc-sv", 
        "front": "Öppna",
        "answer": "To open ;; tr: ǿp-na",
        "detect-all": "öppn"
      },
      {
        "id": "2-15", 
        "type": "trad", 
        "front": "I thought things would change quickly, but I was wrong.",
        "sv": "Jag trodde att saker skulle förändras snabbt, men jag hade fel. ;; tr: yag trod-de at sá-ker skú-le fø-rén-dras snapt, men yag há-de fel"
      },
      {
        "id": "2-16", "type": "voc-sv", 
        "front": "Saker",
        "answer": "Things ;; tr: sá-ker",
        "detect": "saker, sak"
      },
      {
        "id": "2-17", "type": "voc-sv", 
        "front": "Skulle",
        "answer": "Would ;; tr: skú-le",
        "detect": "skulle",
      },
      {
        "id": "2-18", "type": "voc-sv", 
        "front": "Förändras",
        "answer": "To change ;; tr: fø-rén-dras",
        "detect-all": "förändr"
      },
            {
        "id": "2-19", 
        "type": "trad", 
        "front": "I have already called the office twice this week.",
        "sv": "Jag har redan ringt kontoret två gånger den här veckan. ;; tr: yag har réː-dan ringt kon-túː-ret tvoː góng-er den här vé-kan"
      },
      {
        "id": "2-20", 
        "type": "trad", 
        "front": "A whole year has passed, and I'm still trying to get all of this started.",
        "sv": "Ett helt år har gått, och jag försöker fortfarande få igång allt det här. ;; tr: et helt oːr har got, o yag føşǿːker fórtfarande foː i-góng alt de hár"
      },
      {
        "id": "2-21", "type": "voc-sv", 
        "front": "Gå",
        "answer": "To go ;; tr: goː",
        "detect": "gå, gått, gick, går"
      },
      {
        "id": "2-22", "type": "voc-sv", 
        "front": "Försöka",
        "answer": "To try ;; tr: føşǿː-ka",
        "detect": "försöka, försöker, försökte, försökt",
        "detect-all": "försök"
      },
      {
        "id": "2-23", "type": "voc-sv", 
        "front": "Få",
        "answer": "To get ;; tr: foː",
        "detect": "få, får, fick, fått",
        "detect-all": "få, fick"
      }, 
      {
        "id": "2-24", 
        "type": "trad", 
        "front": "It was a good day.",
        "it": "È stata una bella giornata. ;; tr: eh stá-ta ú-na bél-la jor-ná-ta",
        "sv": "Det var en bra dag. ;; tr: de var en brá dág"
      },
            {
        "id": "2-25", 
        "type": "trad", 
        "front": "This is a book I read a long time ago.",
        "it": "Questo è un libro che ho letto molto tempo fa. ;; tr: kwés-to e un lí-bro ke o lét-to mól-to tém-po fa",
        "sv": "Det här är en bok som jag läste för länge sedan. ;; tr: de-hár er en buk som ya lés-te før lén-ge sé-dan"
      },
      {
        "id": "2-26", 
        "type": "trad", 
        "front": "We are waiting at the subway station, holding hands.",
        "it": "Stiamo aspettando alla stazione della metro, tenendoci per mano.",
        "sv": "Vi väntar på tunnelbanestationen, hand i hand."
      },
      {
        "id": "2-27", 
        "type": "trad", 
        "front": "She wants an ice cream but he wants something else.",
        "it": "Lei vuole un gelato ma lui vuole qualcos'altro. ;; tr: lei vuó-le un dğe-lá-to ma lú-i vuó-le kwal-koz-ál-tro",
        "sv": "Hon vill ha en glass men han vill ha något annat. ;; tr: hon vil ha en glas men han vil ha nó-got á-nat"
      },
    ]
  },  
  // ==========================================
  // DECK 3
  // ==========================================
  {
    "id": "3",
    "name": "New European Scripture",
    "defaultDate": "4/11/2026",
    "cards": [
      {
        "id": "3-1", "type": "read-ru", 
        "front": "А / а",
        "answer": "Se prononce comme le 'a' français. ;; nt: Alphabet cyrillique russe."
      },
      {
        "id": "3-2", "type": "read-ru", 
        "front": "Б / б",
        "answer": "Se prononce comme le 'b' français."
      },
      {
        "id": "3-3", "type": "read-ru", 
        "front": "В / в",
        "answer": "Se prononce comme le 'v' français."
      },
      {
        "id": "3-4", "type": "read-ru", 
        "front": "Г / г",
        "answer": "Se prononce comme le 'g' de 'gare'."
      },
      {
        "id": "3-5", "type": "read-ru", 
        "front": "Д / д",
        "answer": "Se prononce comme le 'd' français."
      },
      {
        "id": "3-6", "type": "read-el", 
        "front": "Α / α (Alpha)",
        "answer": "Se prononce comme le 'a' français. ;; nt: Alphabet grec."
      },
      {
        "id": "3-7", "type": "read-el", 
        "front": "Β / β (Bêta)",
        "answer": "Se prononce comme un 'v' français."
      },
      {
        "id": "3-8", "type": "read-el", 
        "front": "Γ / γ (Gamma)",
        "answer": "Se prononce comme un 'g' très doux, proche du 'y' ou du 'gh'."
      },
      {
        "id": "3-9", "type": "read-el", 
        "front": "Δ / δ (Delta)",
        "answer": "Se prononce comme le 'th' de 'this' en anglais."
      },
      {
        "id": "3-10", "type": "read-el", 
        "front": "Ε / ε (Epsilon)",
        "answer": "Se prononce comme le 'é' français."
      }
    ]
  },
];