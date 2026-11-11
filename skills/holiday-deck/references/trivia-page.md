# דף הטריוויה

מקור: `passover-trivia.html` של מצגת פסח 2026.

## העיקרון: אי אפשר להפסיד

זו לא בחינה. זה משחק כיתתי שמתנהל בקול רם, ילד אחד מפעיל וכולם עונים ביחד.
לכן **תשובה שגויה לא מסיימת את התור**: היא רק מוציאה את עצמה מהמשחק:

```js
if (isOk) {
  answered = true; score++;
  btns.forEach((b,i) => { b.disabled = true; if (i === idx) b.classList.add('correct'); });
  fbTitle.textContent = '🎉 Correct! You got it!';
  fbDetail.textContent = q.correctFeedback;
  launchConfetti();
} else {
  btns[idx].classList.add('wrong');                 // shake אדום
  fbTitle.textContent = '😬 Not quite — try again!';
  fbDetail.textContent = 'Pick another answer!';
  setTimeout(() => {
    btns[idx].classList.remove('wrong');
    btns[idx].classList.add('wrong-out');           // מתפוגג
    btns[idx].disabled = true;                      // ונחסם, אבל השאלה ממשיכה
    setTimeout(() => { fb.className = 'feedback-box'; }, 600);
  }, 500);
}
```

כפתור "Next" מופיע **רק אחרי תשובה נכונה**. אין דרך להתקדם עם טעות.
ולכן מסך הסיום תמיד:

```js
document.getElementById('score-number').textContent = `${total}/${total}`;
titleEl.textContent = 'Class Wins!';
document.getElementById('score-message').textContent =
  'Amazing teamwork! You answered every question together — Moses would be proud! 🌟';
launchConfetti(); launchConfetti(); launchConfetti();
```

**זו החלטה מכוונת, לא באג.** אם משנים אותה, משנים את כל אופי המשחק.

## מבנה השאלה

```js
{
  emoji: "🔢",
  text: "How many plagues hit Egypt?",
  answers: [
    { icon:"5️⃣",  label:"Five",   correct:false },
    { icon:"🔟",  label:"Ten",     correct:true  },
    { icon:"7️⃣",  label:"Seven",  correct:false },
    { icon:"1️⃣2️⃣", label:"Twelve", correct:false },
  ],
  correctFeedback: "YES! 10 epic plagues — frogs, locusts, darkness and more! 🐸🌑🦟",
  wrongFeedback:   "It was 10 plagues! God really meant business 💪"
}
```

חובה בכל שאלה:
- **אימוג'י לשאלה** (מתנדנד ב-`wiggle .6s` בכל רנדור)
- **4 תשובות, כל אחת עם אייקון**
- **שני משובים כתובים מראש**: גם לנכונה וגם לשגויה. שניהם בקול של ילד, עם קריאה ואימוג'י.

## המסיחים: חצי מהכיף

מסיח טוב הוא **סביר מספיק כדי לחשוב עליו, ומצחיק מספיק כדי לצחוק כשמבינים**:

| שאלה | המסיח המצחיק |
| :-- | :-- |
| מה זה אפיקומן? | "Pharaoh's cat's name" 🐱 |
| מה הנושא של פסח? | "Winter is coming" ❄️ |
| למה אוכלים מצה? | "They forgot the bread recipe" 😅 |
| מה אוכלים במקום לחם? | Baguette 🥖 · Tortilla 🌮 · Croissant 🥐 |

לעולם לא מסיחים אקראיים או מטופשים מדי, הם חייבים להיות מהעולם של הילדים.

## שלושה מסכים

```
screen-intro  → 🪄 כותרת · "12 Questions · Answer Together · Have Fun!" · כפתור "Let's Go! 🚀"
screen-quiz   → פס התקדמות · כרטיס שאלה · רשת 4 תשובות · קופסת משוב · כפתור Next
screen-score  → 🏆 "Class Wins!" · 12/12 · הודעה · סקירת כל השאלות · "Play Again! 🔄"
```

מסך הסיום מציג **סקירה של כל השאלות** עם ✅ לכל אחת, הילדים אוהבים לראות את הרשימה.

## קונפטי

```js
const confettiColors = ['#F5A623','#E8531A','#E91E8C','#27AE60','#0E8C8C','#FFD700','#fff'];
function launchConfetti() {
  for (let i = 0; i < 60; i++) setTimeout(() => {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random()*100 + 'vw';
    el.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
    el.style.width  = (8 + Math.random()*10) + 'px';
    el.style.height = (8 + Math.random()*10) + 'px';
    el.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    el.style.animationDuration = (1.5 + Math.random()*2) + 's';
    el.style.animationDelay    = (Math.random()*.5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);     // ניקוי, אחרת ה-DOM מתנפח
  }, i * 20);                                 // stagger, לא כולם ביחד
}
```

```css
@keyframes confetti-fall {
  0%   { transform: translateY(0) rotate(0deg);     opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}
```

`i * 20` ה-stagger ו-`Math.random() > .5` לצורה (עיגול או ריבוע), שני פרטים קטנים
שהופכים את זה מ"חתיכות נופלות" לקונפטי אמיתי.

## לתקן בפעם הבאה

- `<div class="progress-label">Question 1 of 7</div>` מקודד קשיח ב-HTML כשיש 12 שאלות.
  ה-JS דורס מיד, אבל לכתוב `Question 1 of 12` או להשאיר ריק.
- `score-number` מקודד `${total}/${total}`: **התנהגות נכונה, כתיבה לא ברורה.**
  להוסיף הערה בקוד: `// כולם מנצחים, בכוונה. אין דרך לענות שגוי ולהתקדם.`
