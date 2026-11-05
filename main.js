const frontText = document.getElementById('frontText');
const frontFlags = document.getElementById('frontFlags');
const answersContainer = document.getElementById('answersContainer');
const cardInner = document.getElementById('cardInner');
const btnTrue = document.getElementById('btnTrue');
const btnFalse = document.getElementById('btnFalse');
const btnValidate = document.getElementById('btnValidate');
const btnRestart = document.getElementById('btnRestart');
const countEnCours = document.querySelector('.en-cours .count');
const countConnus = document.querySelector('.connus .count');
const reverseToggle = document.getElementById('reverseCardToggle');
const toggleContainer = document.getElementById('toggleContainer');

const dateMinInput = document.getElementById('dateMin');
const dateMaxInput = document.getElementById('dateMax');
const dateDisplayStart = document.getElementById('dateDisplayStart');
const dateDisplayEnd = document.getElementById('dateDisplayEnd');

const tooltipEl = document.getElementById('global-tooltip');

let allCards = [];         
let activeDeck = [];       
let sessionCards = [];     
let currentCard = null;    
let isAnimating = false;
let vocabDictionary = []; 

const DELAY_10M = 10 * 1000; 
const DELAY_20M = 20 * 1000; 

const langInfo = {
    'it': { label: 'IT', class: 'badge-it' }, 'es': { label: 'ES', class: 'badge-es' },
    'sv': { label: 'SV', class: 'badge-sv' }, 'ja': { label: 'JA', class: 'badge-ja' },
    'zh': { label: 'ZH', class: 'badge-zh' }, 'he': { label: 'HE', class: 'badge-he' },
    'ar': { label: 'AR', class: 'badge-ar' }, 'pt': { label: 'PT', class: 'badge-pt' },
    'en': { label: 'EN', class: 'badge-en' }, 'fr': { label: 'FR', class: 'badge-fr' },
    'ru': { label: 'RU', class: 'badge-ru' }, 'el': { label: 'EL', class: 'badge-el' }
};

// --- GESTION DES DATES ET DU DECK ---
function parseDate(str) { 
    if (!str || str === "???") return new Date(); 
    const [d, m, y] = str.split('/'); 
    return new Date(y, m - 1, d); 
}
function formatDate(timestamp) { 
    const d = new Date(timestamp); 
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; 
}

function processDeckData() {
    allCards = [];
    deckData.forEach(deck => {
        const deckDate = (deck.defaultDate && deck.defaultDate !== "???") ? deck.defaultDate : formatDate(Date.now());
        if (deck.cards && Array.isArray(deck.cards)) {
            deck.cards.forEach(card => {
                allCards.push({
                    ...card,
                    date: card.date || deckDate,
                    deckId: deck.id,
                    deckName: deck.name
                });
            });
        }
    });
}

function updateFilterCounts() {
    // 1. Compter les types de cartes
    const types = { 'trad': 'Translation', 'gr': 'Grammar', 'voc': 'Vocabulry', 'read': 'Reading' };
    Object.keys(types).forEach(type => {
        const count = allCards.filter(c => c.type.startsWith(type)).length;
        const input = document.querySelector(`.type-filter[value="${type}"]`);
        if (input && input.nextElementSibling) {
            input.nextElementSibling.textContent = `${types[type]} (${count})`;
        }
    });

    // 2. Compter les langues
    const languages = { 
        'sv': 'Svenska', 'en': 'English', 'fr': 'Français', 'es': 'Español', 
        'it': 'Italiano', 'ja': '日本語', 'zh': '中文', 'he': 'עברית', 
        'ar': 'العربية', 'pt': 'Português', 'ru': 'Русский', 'el': 'Ελληνικά'
    };
    Object.keys(languages).forEach(lang => {
        // On compte si la carte a la clé de la langue OU si son type finit par cette langue
        const count = allCards.filter(c => c[lang] !== undefined || c.type.endsWith(`-${lang}`)).length;
        const input = document.querySelector(`.lang-filter[value="${lang}"]`);
        if (input && input.nextElementSibling) {
            input.nextElementSibling.textContent = `${languages[lang]} (${count})`;
        }
    });
}

// --- LOGIQUE DE DICTIONNAIRE ET TOOLTIP ---
function buildVocabulary() {
    vocabDictionary = [];
    allCards.filter(c => c.type.startsWith('voc')).forEach(card => {
        let detectList = []; let detectAllList = []; let detectOffList = [];

        if (card.detect) detectList = card.detect.split(',').map(w => w.trim()).filter(w => w);
        if (card['detect-all']) detectAllList = card['detect-all'].split(',').map(w => w.trim()).filter(w => w);
        if (card['detect-off']) detectOffList = card['detect-off'].split(',').map(w => w.trim()).filter(w => w);

        let definition = "Pas de définition"; let note = null; let translit = null;
        if (card.answer) {
            const parsed = parseTranslation(card.answer);
            definition = parsed.text; note = parsed.note; translit = parsed.translit;
        }

        vocabDictionary.push({
            word: card.front, definition: definition, note: note, translit: translit,
            detect: detectList, detectAll: detectAllList, detectOff: detectOffList
        });
    });
}

function findWordInfo(word) {
    let results = [];
    vocabDictionary.forEach(vocab => {
        let isOff = vocab.detectOff.some(offWord => offWord === word);
        if (isOff) return;
        let isExact = vocab.detect.includes(word);
        let isAll = vocab.detectAll.some(allWord => word.includes(allWord));
        if (isExact || isAll) results.push(vocab);
    });
    return results;
}

function highlightText(html) {
    if (vocabDictionary.length === 0) return html;
    const div = document.createElement('div');
    div.innerHTML = html;

    let detectTerms = []; 
    let detectAllTerms = [];
    let offTerms = [];
    
    vocabDictionary.forEach(vocab => {
        detectTerms = detectTerms.concat(vocab.detect);
        detectAllTerms = detectAllTerms.concat(vocab.detectAll);
        offTerms = offTerms.concat(vocab.detectOff);
    });
    
    detectTerms = [...new Set(detectTerms.filter(t => t))];
    detectAllTerms = [...new Set(detectAllTerms.filter(t => t))];
    offTerms = [...new Set(offTerms.filter(t => t))];

    if (detectTerms.length === 0 && detectAllTerms.length === 0) return html;

    // On utilise Intl.Segmenter pour découper le texte en mots entiers
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
    
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
    let node; const nodesToReplace = [];
    while (node = walker.nextNode()) nodesToReplace.push(node);

    nodesToReplace.forEach(textNode => {
        const text = textNode.nodeValue;
        const segments = segmenter.segment(text);
        const fragment = document.createDocumentFragment();
        let hasMatch = false;

        for (const { segment } of segments) {
            const word = segment;
            
            // 1. Est-ce que le mot entier est dans detect ?
            const isExact = detectTerms.includes(word);
            
            // 2. Est-ce que le mot entier contient une racine de detect-all ?
            const isAll = detectAllTerms.some(term => word.includes(term));
            
            if (isExact || isAll) {
                let isOff = false;
                
                // 3. Si ce n'est pas un mot exact, on vérifie les exceptions (detect-off)
                if (!isExact) {
                    for (let offWord of offTerms) {
                        if (word.includes(offWord)) { isOff = true; break; }
                    }
                }
                
                if (!isOff) {
                    // ON SURLIGNE LE MOT EN ENTIER !
                    const span = document.createElement('span');
                    span.className = 'detect-word';
                    span.setAttribute('data-text', word); // On garde le mot entier pour le tooltip
                    span.textContent = word;
                    fragment.appendChild(span);
                    hasMatch = true;
                    continue;
                }
            }
            // Si ce n'est pas un match (ou si c'est bloqué), on ajoute le mot normalement
            fragment.appendChild(document.createTextNode(word));
        }

        if (hasMatch) {
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
    return div.innerHTML;
}

function showTooltip(e, word) {
    if (!tooltipEl) return;
    const infos = findWordInfo(word);
    if (infos.length === 0) return;

    let html = '';
    infos.forEach(info => {
        html += `<div class="tooltip-item">`;
        html += `<span class="tooltip-word">${info.word}</span>`;
        if (info.translit) html += `<span class="tooltip-translit">[ ${info.translit} ]</span>`;
        html += `<div class="tooltip-def">${info.definition}</div>`;
        if (info.note) html += `<span class="tooltip-note">${info.note}</span>`;
        html += `</div>`;
    });

    tooltipEl.innerHTML = html;
    tooltipEl.style.pointerEvents = 'auto';
    tooltipEl.classList.add('visible');
    
    setTimeout(() => {
        const rect = e.target.getBoundingClientRect();
        let topPos = rect.top + window.scrollY - tooltipEl.offsetHeight - 10;
        let leftPos = rect.left + window.scrollX;

        if (topPos < 10) topPos = rect.bottom + window.scrollY + 10;
        if (leftPos + tooltipEl.offsetWidth > window.innerWidth) leftPos = window.innerWidth - tooltipEl.offsetWidth - 20;

        tooltipEl.style.left = `${leftPos}px`;
        tooltipEl.style.top = `${topPos}px`;
    }, 10);
}

function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.classList.remove('visible');
}

tooltipEl.addEventListener('click', (e) => e.stopPropagation());

document.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('detect-word')) showTooltip(e, e.target.getAttribute('data-text'));
});

document.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('detect-word') && !e.target.classList.contains('active')) hideTooltip();
});

document.addEventListener('click', (e) => {
    if (e.target.closest('#global-tooltip')) return; 
    if (e.target.classList.contains('detect-word')) {
        e.stopPropagation(); e.preventDefault();
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')) showTooltip(e, e.target.getAttribute('data-text'));
        else hideTooltip();
    } else {
        document.querySelectorAll('.detect-word.active').forEach(el => el.classList.remove('active'));
        hideTooltip();
    }
}, true);

// --- LOGIQUE DE SESSION ---
function initTimeline() {
    let minTime = Infinity; let maxTime = -Infinity;
    allCards.forEach(card => {
        const time = parseDate(card.date).getTime();
        if (time < minTime) minTime = time;
        if (time > maxTime) maxTime = time;
    });
    if (maxTime === minTime) maxTime += 1000 * 60 * 60 * 24; 
    dateMinInput.min = minTime; dateMinInput.max = maxTime; dateMinInput.value = minTime;
    dateMaxInput.min = minTime; dateMaxInput.max = maxTime; dateMaxInput.value = maxTime;

    const yearsContainer = document.getElementById('timelineYears');
    yearsContainer.innerHTML = '';
    const startYear = new Date(minTime).getFullYear();
    const endYear = new Date(maxTime).getFullYear();
    let lastPercent = -100;

    for (let y = startYear; y <= endYear; y++) {
        const yearStart = new Date(y, 0, 1).getTime();
        const actualTime = Math.max(minTime, Math.min(maxTime, yearStart));
        const percent = ((actualTime - minTime) / (maxTime - minTime)) * 100;
        if (percent - lastPercent > 8) {
            const span = document.createElement('span');
            span.textContent = y;
            span.style.left = `${percent}%`;
            if (percent < 5) span.style.transform = 'translateX(0%)';
            else if (percent > 95) span.style.transform = 'translateX(-100%)';
            yearsContainer.appendChild(span);
            lastPercent = percent; 
        }
    }
    const ticksContainer = document.getElementById('timelineTicks');
    ticksContainer.innerHTML = '';
    allCards.forEach(card => {
        const time = parseDate(card.date).getTime();
        const percent = ((time - minTime) / (maxTime - minTime)) * 100;
        const tick = document.createElement('div');
        tick.className = 'timeline-tick';
        tick.style.left = `${percent}%`;
        ticksContainer.appendChild(tick);
    });
    updateDateDisplay();
    dateMinInput.addEventListener('input', updateDateDisplay);
    dateMaxInput.addEventListener('input', updateDateDisplay);
}

function updateDateDisplay() {
    let valMin = parseInt(dateMinInput.value); let valMax = parseInt(dateMaxInput.value);
    if (valMin > valMax) { dateMinInput.value = valMax; valMin = valMax; }
    dateDisplayStart.textContent = formatDate(valMin); dateDisplayEnd.textContent = formatDate(valMax);
    updateActiveDeck(); 
}

function updateActiveDeck() {
    const minVal = parseInt(dateMinInput.value);
    const maxVal = parseInt(dateMaxInput.value);
    const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
    
    activeDeck = allCards.filter(card => {
        const cardTime = parseDate(card.date).getTime();
        const typeMatch = selectedTypes.some(t => card.type.startsWith(t));
        return cardTime >= minVal && cardTime <= maxVal && typeMatch;
    });
    buildVocabulary(); 
    initSession();
}

function updateToggleVisibility() {
    const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
    if (selectedTypes.includes('trad') || selectedTypes.includes('voc')) toggleContainer.style.display = 'flex';
    else toggleContainer.style.display = 'none';
}

function initSession() {
    let deckToUse = [...activeDeck];
    const selectedLangs = Array.from(document.querySelectorAll('.lang-filter:checked')).map(cb => cb.value);

    if (reverseToggle.checked) {
        let reversedDeck = [];
        deckToUse.forEach(card => {
            // Inversion uniquement pour trad et voc
            if (card.type === 'trad' || card.type.startsWith('voc')) {
                if (card.type.startsWith('voc')) {
                    const parsedTrad = parseTranslation(card.answer);
                    const langKey = card.type.split('-')[1];
                    let revCard = {
                        id: card.id + "-rev", type: card.type, date: card.date,
                        front: parsedTrad.text, isReversed: true, reversedLang: langKey,
                        originalText: card.front, originalTrad: parsedTrad, deckId: card.deckId, deckName: card.deckName
                    };
                    revCard.answer = card.front;
                    reversedDeck.push(revCard);
                } else {
                    const langues = Object.keys(card).filter(key => !['id', 'type', 'date', 'front', 'deckId', 'deckName'].includes(key) && selectedLangs.includes(key));
                    if (langues.length === 0) reversedDeck.push(card);
                    else {
                        langues.forEach(lang => {
                            const parsedTrad = parseTranslation(card[lang]);
                            let revCard = {
                                id: card.id + "-rev-" + lang, type: card.type, date: card.date,
                                front: parsedTrad.text, isReversed: true, reversedLang: lang,
                                originalText: card.front, originalTrad: parsedTrad, deckId: card.deckId, deckName: card.deckName
                            };
                            revCard[lang] = card.front; 
                            reversedDeck.push(revCard);
                        });
                    }
                }
            } else {
                reversedDeck.push(card);
            }
        });
        deckToUse = reversedDeck;
    }

    for (let i = deckToUse.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckToUse[i], deckToUse[j]] = [deckToUse[j], deckToUse[i]];
    }

    sessionCards = deckToUse.map(card => {
        let langStatus = {};
        // ⚠️ CORRECTION : Ajout de "read" dans la condition
        if (card.type.startsWith('voc') || card.type.startsWith('gr') || card.type.startsWith('read')) {
            const langKey = card.type.split('-')[1] || 'en';
            langStatus[langKey] = { stage: 0, dueTime: 0 };
        } else {
            Object.keys(card).forEach(key => {
                if (!['id', 'type', 'date', 'front', 'isReversed', 'reversedLang', 'originalText', 'originalTrad', 'detect', 'detect-all', 'detect-off', 'deckId', 'deckName', 'answer'].includes(key)) {
                    langStatus[key] = { stage: 0, dueTime: 0 };
                }
            });
        }
        return { ...card, langStatus };
    });
    
    updateCounters();
    updateSession();
}

function updateCounters() {
    let enCours = 0; let connus = 0;
    const selectedLangs = Array.from(document.querySelectorAll('.lang-filter:checked')).map(cb => cb.value);
    
    sessionCards.forEach(card => {
        let unmasteredLangs;
        // ⚠️ CORRECTION : Ajout de "read"
        if (card.type.startsWith('voc') || card.type.startsWith('gr') || card.type.startsWith('read')) {
            const langKey = card.type.split('-')[1] || 'en';
            unmasteredLangs = card.langStatus[langKey].stage < 3 ? 1 : 0;
        } else {
            unmasteredLangs = Object.keys(card.langStatus).filter(lang => card.langStatus[lang].stage < 3 && selectedLangs.includes(lang)).length;
        }
        if (unmasteredLangs === 0) connus++; else enCours++;
    });
    countEnCours.textContent = enCours;
    countConnus.textContent = connus;
}

function updateSession() {
    const now = Date.now();
    const selectedLangs = Array.from(document.querySelectorAll('.lang-filter:checked')).map(cb => cb.value);
    
    sessionCards.forEach(c => {
        let unmasteredLangs;
        // ⚠️ CORRECTION : Ajout de "read"
        if (c.type.startsWith('voc') || c.type.startsWith('gr') || c.type.startsWith('read')) {
            const langKey = c.type.split('-')[1] || 'en';
            unmasteredLangs = c.langStatus[langKey].stage < 3 ? [langKey] : [];
        } else {
            unmasteredLangs = Object.keys(c.langStatus).filter(lang => c.langStatus[lang].stage < 3 && selectedLangs.includes(lang));
        }
        
        if (unmasteredLangs.length === 0) c.overallDueTime = Infinity; 
        else c.overallDueTime = Math.min(...unmasteredLangs.map(lang => c.langStatus[lang].dueTime));
    });

    let cardsToReview = sessionCards.filter(c => c.overallDueTime !== Infinity);

    if (cardsToReview.length === 0) {
        currentCard = null;
        frontText.textContent = "🎉 Terminé pour cette sélection !";
        frontText.style.color = "#94a3b8";
        frontFlags.innerHTML = ''; answersContainer.innerHTML = '';
        btnTrue.style.display = 'none'; btnFalse.style.display = 'none'; btnValidate.style.display = 'none';
        btnRestart.style.display = 'flex'; 
        if (cardInner.classList.contains('is-flipped')) cardInner.classList.remove('is-flipped');
        return;
    }

    cardsToReview.sort((a, b) => a.overallDueTime - b.overallDueTime);
    let nextCard = cardsToReview[0];
    if (nextCard.overallDueTime > now) nextCard.overallDueTime = now; 
    currentCard = nextCard;
    
    if (cardInner.classList.contains('is-flipped')) {
        isAnimating = true;
        cardInner.classList.remove('is-flipped');
        btnTrue.style.display = 'none'; btnFalse.style.display = 'none'; btnValidate.style.display = 'none'; btnRestart.style.display = 'none';
        setTimeout(() => {
            renderCard(currentCard);
            resetActionButtons();
            isAnimating = false; 
        }, 600);
    } else {
        renderCard(currentCard);
        resetActionButtons();
    }
}

function handleAnswer(action) { 
    if (!currentCard || isAnimating) return;
    const selectedLangs = Array.from(document.querySelectorAll('.lang-filter:checked')).map(cb => cb.value);
    
    let languesCibles;
    // ⚠️ CORRECTION : Ajout de "read"
    if (currentCard.type.startsWith('voc') || currentCard.type.startsWith('gr') || currentCard.type.startsWith('read')) {
        const langKey = currentCard.type.split('-')[1] || 'en';
        languesCibles = currentCard.langStatus[langKey].stage < 3 ? [langKey] : [];
    } else {
        languesCibles = Object.keys(currentCard.langStatus).filter(lang => currentCard.langStatus[lang].stage < 3 && selectedLangs.includes(lang));
    }

    const rows = answersContainer.querySelectorAll('.answer-row');
    
    languesCibles.forEach((lang, index) => {
        let isCorrect = false;
        if (action === 'all_true') isCorrect = true;
        else if (action === 'all_false') isCorrect = false;
        else if (action === 'mixed') {
            const checkbox = rows[index] ? rows[index].querySelector('input[type="checkbox"]') : null;
            isCorrect = checkbox ? checkbox.checked : false;
        }

        const status = currentCard.langStatus[lang];
        if (isCorrect) {
            if (status.stage === 0) status.stage = 3; 
            else if (status.stage === 1) { status.stage = 2; status.dueTime = Date.now() + DELAY_20M; } 
            else if (status.stage === 2) status.stage = 3; 
        } else {
            status.stage = 1; 
            status.dueTime = Date.now() + DELAY_10M;
        }
    });

    updateCounters();
    updateSession();
}

function renderCard(card) {
    frontText.textContent = card.front;
    frontText.style.color = "#ffffff";
    frontFlags.innerHTML = ''; 
    answersContainer.innerHTML = '';
    
    const selectedLangs = Array.from(document.querySelectorAll('.lang-filter:checked')).map(cb => cb.value);
    
    let languesCibles;
    let isSingleAnswer = card.type.startsWith('voc') || card.type.startsWith('gr') || card.type.startsWith('read');
    let langKey = isSingleAnswer ? (card.type.split('-')[1] || 'en') : null;

    if (isSingleAnswer) {
        languesCibles = card.langStatus[langKey].stage < 3 ? [langKey] : [];
    } else {
        languesCibles = Object.keys(card.langStatus).filter(lang => card.langStatus[lang].stage < 3 && selectedLangs.includes(lang));
    }

    // Affichage des badges au recto (Trad ou Cartes simples non inversées)
    if (!card.isReversed && (card.type === 'trad' || isSingleAnswer)) {
        languesCibles.forEach(langue => {
            const badge = createBadge(langue);
            if (badge) frontFlags.appendChild(badge);
        });
    }

    languesCibles.forEach(langue => {
        const textKey = isSingleAnswer ? 'answer' : langue;
        const parsed = parseTranslation(card[textKey]);
        
        const row = document.createElement('div');
        
        // ==========================================
        // CAS 1 : CARTE INVERSÉE
        // ==========================================
        if (card.isReversed) {
            row.style.display = 'flex'; 
            row.style.flexDirection = 'column'; 
            row.style.alignItems = 'center'; 
            row.style.textAlign = 'center'; 
            row.style.gap = '15px'; 
            row.style.background = 'transparent'; 
            row.style.padding = '0';
            
            // Bloc 1 : La phrase originale (ex: "I have a red car.")
            const ans1 = document.createElement('div'); 
            ans1.className = 'answer-row'; 
            ans1.style.width = '100%'; 
            ans1.style.justifyContent = 'center'; 
            ans1.style.fontSize = '1.3rem'; 
            ans1.style.fontWeight = 'bold'; 
            ans1.textContent = card.originalText; 
            row.appendChild(ans1);
            
            // Bloc 2 : La traduction (avec tr et nt)
            const ans2 = document.createElement('div'); 
            ans2.className = 'answer-row'; 
            ans2.style.width = '100%'; 
            ans2.style.justifyContent = 'center'; 
            ans2.style.backgroundColor = 'rgba(255,255,255,0.03)';
            
            const textDiv = document.createElement('div'); 
            textDiv.className = 'answer-text'; 
            textDiv.style.textAlign = 'center'; 
            textDiv.style.color = '#94a3b8';
            textDiv.innerHTML = highlightText(card.originalTrad.text);
            
            if (card.originalTrad.translit) { 
                const ts = document.createElement('span'); 
                ts.className = 'answer-translit'; 
                ts.textContent = `[ ${card.originalTrad.translit} ]`; 
                textDiv.appendChild(ts); 
            }
            if (card.originalTrad.note) { 
                const ns = document.createElement('span'); 
                ns.className = 'answer-note'; 
                ns.textContent = `Note: ${card.originalTrad.note}`; 
                textDiv.appendChild(ns); 
            }
            ans2.appendChild(textDiv); 
            row.appendChild(ans2); 
            row.onclick = (e) => e.stopPropagation();
            
        } 
        // ==========================================
        // CAS 2 : CARTE NORMALE
        // ==========================================
        else {
            row.className = 'answer-row';
            
            // Badge de langue (sauf pour la grammaire/lecture)
            if (card.type === 'trad' || isSingleAnswer) { 
                const badge = createBadge(langue); 
                if (badge) { 
                    badge.style.width = '32px'; 
                    badge.style.height = '24px'; 
                    badge.style.fontSize = '0.7rem'; 
                    row.appendChild(badge); 
                } 
            }

            let checkbox = null;
            // ⚠️ LA NOUVELLE RÈGLE : Case à cocher UNIQUEMENT si c'est une traduction ET qu'il y a plus d'une langue
            if (card.type === 'trad' && languesCibles.length > 1) { 
                checkbox = document.createElement('input'); 
                checkbox.type = 'checkbox'; 
                checkbox.onclick = (e) => e.stopPropagation(); 
                checkbox.addEventListener('change', updateActionButtons); 
            }

            const textDiv = document.createElement('div'); 
            textDiv.className = 'answer-text';
            textDiv.innerHTML = highlightText(parsed.text);
            
            if (parsed.translit) { 
                const ts = document.createElement('span'); 
                ts.className = 'answer-translit'; 
                ts.textContent = `[ ${parsed.translit} ]`; 
                textDiv.appendChild(ts); 
            }
            if (parsed.note) { 
                const ns = document.createElement('span'); 
                ns.className = 'answer-note'; 
                ns.textContent = `Note: ${parsed.note}`; 
                textDiv.appendChild(ns); 
            }

            if (checkbox) row.appendChild(checkbox);
            row.appendChild(textDiv);
            
            row.onclick = (e) => { 
                if (e.target.classList.contains('detect-word')) return; 
                e.stopPropagation(); 
                document.querySelectorAll('.detect-word.active').forEach(el => el.classList.remove('active'));
                hideTooltip();
                if (checkbox && e.target !== checkbox) { 
                    checkbox.checked = !checkbox.checked; 
                    checkbox.dispatchEvent(new Event('change')); 
                } 
            };
        }
        answersContainer.appendChild(row);
    });
}

function parseTranslation(text) {
    if (typeof text !== 'string') return { text: text, note: null, translit: null };
    const parts = text.split(';;'); let result = { text: parts[0].trim(), note: null, translit: null };
    for (let i = 1; i < parts.length; i++) {
        let part = parts[i].trim().replace(/\s*:\s*/, ':'); 
        if (part.startsWith('nt:')) result.note = part.substring(3).trim();
        else if (part.startsWith('tr:')) result.translit = part.substring(3).trim();
    }
    return result;
}

function createBadge(langue) {
    const info = langInfo[langue]; 
    if (!info) return null;
    const span = document.createElement('span'); span.className = `flag-badge ${info.class}`; span.textContent = info.label; return span;
}

function resetActionButtons() { btnTrue.style.display = 'flex'; btnFalse.style.display = 'flex'; btnValidate.style.display = 'none'; btnRestart.style.display = 'none'; }
function updateActionButtons() { 
    if (!currentCard || currentCard.type !== 'trad' || currentCard.isReversed) return; 
    
    const checkboxes = answersContainer.querySelectorAll('input[type="checkbox"]'); 
    // Si on a 0 ou 1 seule case, on ne fait rien (on laisse les boutons Rouge/Vert)
    if (checkboxes.length <= 1) return; 

    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length; 
    if (checkedCount > 0) { 
        btnTrue.style.display = 'none'; 
        btnFalse.style.display = 'none'; 
        btnValidate.style.display = 'flex'; 
    } else { 
        resetActionButtons(); 
    } 
}
function flipCard() { 
    if (isAnimating) return; 
    document.querySelectorAll('.detect-word.active').forEach(el => el.classList.remove('active'));
    hideTooltip();
    cardInner.classList.toggle('is-flipped'); 
}

btnTrue.onclick = () => handleAnswer('all_true');
btnFalse.onclick = () => handleAnswer('all_false');
btnValidate.onclick = () => handleAnswer('mixed');
btnRestart.onclick = () => initSession();

document.querySelectorAll('.lang-filter').forEach(cb => { cb.addEventListener('change', () => { updateCounters(); updateSession(); }); });
document.querySelectorAll('.type-filter').forEach(cb => { cb.addEventListener('change', () => { updateActiveDeck(); updateToggleVisibility(); }); });
reverseToggle.addEventListener('change', () => { initSession(); });

document.addEventListener('keydown', (e) => {
    if ([' ', 'Enter', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
    if (e.key === ' ') flipCard();
    if (e.key === 'ArrowDown') { if (!cardInner.classList.contains('is-flipped')) cardInner.classList.add('is-flipped'); }
    if (e.key === 'ArrowUp') { if (cardInner.classList.contains('is-flipped')) cardInner.classList.remove('is-flipped'); }
    if (e.key === 'Enter') { if (btnRestart.style.display === 'flex') btnRestart.click(); else if (btnTrue.style.display !== 'none') btnTrue.click(); }
    if (e.key === 'ArrowRight') { if (btnValidate.style.display === 'flex') btnValidate.click(); else if (btnRestart.style.display === 'flex') btnRestart.click(); else if (btnTrue.style.display !== 'none') btnTrue.click(); }
    if (e.key === 'ArrowLeft') { if (btnFalse.style.display !== 'none') btnFalse.click(); }
});

function init() {
    try {
        if (typeof deckData === 'undefined' || deckData.length === 0) throw new Error("Aucun deck trouvé");
        processDeckData(); 
        updateFilterCounts(); 
        initTimeline(); 
        updateToggleVisibility(); 
    } catch (error) {
        frontText.textContent = "Erreur !"; frontText.style.color = "#ef4444"; console.error(error);
    }
}

init();