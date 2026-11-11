# index.html: מתכוני הקוד של המצגת

מקור: `index.html` של מצגת פסח 2026.

## שלד הקובץ

```
<head>
  Google Fonts: Fredoka+One + Nunito:wght@400;700;900;800
  <style>  ← כל ה-CSS, מחולק בבאנרים ═══ לפי שקף
</head>
<body>
  <div id="deck">
    <section class="slide active" id="s1"> … </section>
    <section class="slide" id="s2"> … </section>
    … s9
  </div>
  <div id="plague-overlay" class="hidden"> … </div>   ← ה-overlay האינטראקטיבי
  <button class="nav-prev"> <button class="nav-next">
  <div class="dots"> <div class="counter"> <div class="kb-hint">
  <script>  ← data → interactive engine → slideshow engine
</body>
```

ה-CSS מחולק בבאנרים ברורים, שומר על הקובץ קריא ב-1300 שורות:

```css
/* ═══════════════════════════════════════
   SLIDE 3 — SLAVERY
═══════════════════════════════════════ */
```

כל שקף מקבל prefix משלו למחלקות: `.s3-inner`, `.s3-title`, `.s3-fact`.
בלי מערכת עיצוב משותפת, כל שקף עומד בפני עצמו. זה מכוון: קל לשנות שקף אחד בלי לשבור אחרים.

## בסיס

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; overflow: hidden; font-family: 'Nunito', sans-serif; }
#deck { width: 100vw; height: 100vh; position: relative; overflow: hidden; }

.slide {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: clamp(24px, 4vw, 64px);
  opacity: 0; pointer-events: none;
  transform: translateX(60px) scale(.97);
  transition: opacity .55s cubic-bezier(.4,0,.2,1), transform .55s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.slide.active { opacity: 1; pointer-events: all; transform: translateX(0) scale(1); }
.slide.exit   { opacity: 0; transform: translateX(-60px) scale(.97);
                transition: opacity .35s ease, transform .35s ease; }

/* שכבת ההילות, תמיד מאחורי התוכן */
.slide::before { content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.slide > *     { position: relative; z-index: 1; }
```

## משתני הצבע

```css
:root {
  --mustard:#F5A623;  --deep-blue:#1B2A6B;  --warm-orange:#E8531A;
  --teal:#0D7A7A;     --pink:#C2185B;       --dark-brown:#3E2010;
  --dark-gray:#1A1A2E; --green:#1B5E20;     --purple:#4A148C;
  --crimson:#B71C1C;  --white:#FFFDF7;
}
```
בפועל רוב הגרדיאנטים כתובים ישירות בערכי hex בכל שקף, המשתנים משמשים לטקסט ולאלמנטים חוזרים.

## אנימציות idle: תמיד יש תנועה על המסך

```css
@keyframes float        { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
@keyframes slow-move    { 0%,100%{transform:translateX(0) rotate(0)}     50%{transform:translateX(8px) rotate(3deg)} }
@keyframes trophy-bounce{ 0%,100%{transform:translateY(0) scale(1)}      50%{transform:translateY(-14px) scale(1.05)} }
@keyframes cta-pulse    { 0%,100%{transform:scale(1)}                    50%{transform:scale(1.04)} }
@keyframes matzah-chase { 0%,100%{transform:rotate(-5deg) scale(1)}      50%{transform:rotate(5deg) scale(1.05)} }
```

טריק ים סוף, שני אימוג'י שנפרדים לצדדים ודמות באמצע:
```css
.s5-wave-l { animation: wave-split-l 2.8s ease-in-out infinite alternate; }  /* translateX(-70px) */
.s5-wave-r { animation: wave-split-r 2.8s ease-in-out infinite alternate; }  /* translateX(+70px) */
.s5-person { position:absolute; left:50%; transform:translateX(-50%); animation: person-walk 2.5s …; }
```

## מנוע השקופיות

```js
const slides = document.querySelectorAll('.slide');
let current = 0, isAnimating = false;

function goTo(index) {
  if (isAnimating || index === current) return;
  isAnimating = true;
  const prev = slides[current], next = slides[index];
  prev.classList.add('exit'); prev.classList.remove('active');
  next.classList.add('active');

  if (current === 3 || index === 3) resetPlagues();   // reset האינטראקציה

  current = index;
  document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === current));
  counter.textContent = `${current+1} / ${slides.length}`;
  setTimeout(() => { prev.classList.remove('exit'); isAnimating = false; }, 550);
}
```

**נעילת `isAnimating` חיונית**: בלעדיה לחיצות מהירות שוברות את הסטייט.

## חטיפת הניווט בשקף האינטראקטיבי

```js
document.addEventListener('keydown', e => {
  if (e.key==='ArrowRight' || e.key==='ArrowDown' || e.key===' ') {
    e.preventDefault();
    if (current === 3) advancePlague();   // ← בשקף 4 מקדמים פריט, לא שקף
    else changeSlide(1);
  } else if (e.key==='ArrowLeft' || e.key==='ArrowUp') {
    e.preventDefault(); changeSlide(-1);
  }
});
```

## מנוע החלקיקים

הפריטים הם data טהור:
```js
const plagues = [
  { icon:'🩸', name:'Blood',  anim:{ bg:'#5a0000', label:'🩸 BLOOD!', color:'#ff6b6b',
                                     type:'rain', emoji:['🩸','💧'], count:40 } },
  { icon:'🌑', name:'Darkness', anim:{ bg:'#000', label:'🌑 DARKNESS...', color:'#555',
                                       type:'dark', emoji:[], count:0 } },
];
```

הרנדור בונה `count` ספאנים, מגריל לכל אחד מיקום/גודל/משך/דיליי, ומזין ל-CSS דרך custom properties:
```js
p.style.setProperty('--dur',   dur + 's');
p.style.setProperty('--delay', delay + 's');   // שלילי! כדי שהחלקיקים לא יתחילו יחד
p.classList.add('p-rain');
```

```css
.p-rain  { animation: p-rain  var(--dur) var(--delay,0s) infinite linear; }
.p-jump  { animation: p-jump  var(--dur) var(--delay,0s) infinite ease-in-out; }
.p-swarm { animation: p-swarm var(--dur) var(--delay,0s) infinite ease-in-out alternate; }
.p-float { animation: p-float var(--dur) var(--delay,0s) infinite ease-in-out alternate; }
```

**דיליי שלילי אקראי** (`Math.random() * -4`), כך האנימציה נראית כאילו היא כבר רצה, ולא כמו מסך שנפתח.

הבהוב החושך, בלי חלקיקים בכלל, רק הרקע:
```css
@keyframes darkness-flicker {
  0%,88%,100%{opacity:1} 89%{opacity:.5} 90%{opacity:1} 91%{opacity:.3} 92%{opacity:.9}
}
```

טריק הפעלה-מחדש של אנימציית הכותרת:
```js
label.style.animation = 'none';
label.offsetHeight;        // כפיית reflow
label.style.animation = '';
```

## רספונסיביות

media query אחד בלבד:
```css
@media (max-width: 600px) {
  .s3-inner, .s6-inner, .s7-inner { flex-direction: column; text-align: center; }
  .phrase-card { flex-direction: column; text-align: center; }
  .plate-item-desc { display: none; }   /* מוותרים על פירוט במסך קטן */
}
```
כל השאר מטופל ב-`clamp()`.
