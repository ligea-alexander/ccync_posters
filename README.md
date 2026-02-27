# Documenting My Approach / Method (with a smidgeeee of Vibe Coding)

## Conception

Antecedence:

The very popular (in web development world) Elegant Seagulls "pooping values flapping bird" [https://www.elegantseagulls.com/about](https://www.elegantseagulls.com/about).

The idea was to create a game like version but instead of the bird pooping/scoring values on `keydown`, the poop would form the CC NYC announcement. The key points of the announcement could also similarly be broken up into 3 poops: "Creative Coding NYC", "Tuesday", "Pier 57: 6-8PM".

**The Beats:**

Sprout becomes a letter chunk:
first drops build CC NYC
then Feb 27
then 6–8pm

## Implementation

There are a good few ways to go about this, the important thing in creating CC NYC posters is 'No AI slop / vibe coding'. Ah well, I used vibe coding to cut down on time but I stuck to tools I actually know which are just HTML/CSS/JS and GSAP.

I'll list very briefly all the possible approaches I could have taken to create this game, and then I'll go into more detail about the one I chose.

### Possible Approaches:

1. Using a game development framework like Phaser.js or Unity.
2. Building the game from scratch using HTML5 Canvas and JavaScript.
3. Utilizing a game engine like Godot or Unreal Engine.
4. Creating a simple web-based game using p5.js.

After submitting, I think I'll definitely return and explore the p5.js approach as well, but for now, I wanted to stick to tools I already know and can quickly implement with.

### Chosen Approach: Building the game from scratch using HTML5 Canvas and JavaScript (and a little GSAP for silky animations)

1. Set up the HTML structure with a canvas element for the game.
2. Style the game using CSS to make it visually appealing and in line with the CC NYC branding.
3. Use JavaScript to create the game logic, including the bird's movement and the poop mechanism.
4. Implement the keyup event listener to trigger the poop and display the corresponding text.
5. Use GSAP for smooth animations of the bird and the poop.

### Implementation Details:

The method of set up / design was difficult to decide on. There's a number of ways like:

1. SVG bird (best control)
   If the bird is an SVG with wings as separate paths/groups (<g id="wingL">, <g id="wingR">), you can rotate/scale those wing groups with GSAP.
   **Pros:** smooth, tiny file, easy to tweak flap speed/amplitude.
   **Con:** you need the wings as separate elements in the SVG.

2. 2–3 PNG frames (fastest + looks “pixel-authentic”)
   Use 3 images: wing-up / mid / wing-down.
   Animate by swapping img.src (or toggling opacity across stacked images) on a timer, while GSAP moves the whole bird left-right.
   **Pros:** super quick, no SVG prep.
   **Con:** frame swapping can look choppy if you don’t preload.

3. Sprite sheet (cleanest for pixel animation)
   One PNG with frames in a row. Animate background-position steps.
   **Pros:** classic game feel, very efficient, consistent.
   **Con:** you need/make the sprite sheet.

I endedup going with the **sprite sheet method**.

I built from scratch using **HTML5 Canvas and JavaScript** with **GSAP for animations**. The bird and poop use sprite sheets—one PNG per animation with all frames in a row. Canvas draws the correct frame each tick while GSAP handles smooth movement. This gave me the classic pixel-game feel, clean code, and quick iteration without external dependencies.

Then came how I was going to achieve the behavior, of the bird, the poop, and the text appearing on keyup.

The essentials of the poop mechanism are:

- A `keydown` listener

Core idea:

```javascript
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    dropPoop();
  }
});
```

- Create a “poop” element
- Position it at the bird’s current coordinates
- Animate it downward (CSS or GSAP)
- Remove it after it falls

#### Animating the bird and the poop:

For animating the sprite sheet (both bird and poop), I used a simple frame index that increments on each animation tick, looping back to the start when it reaches the end of the sheet. GSAP handles the smooth movement of the bird across the screen, while the canvas redraws the correct frame based on the current index.

I used these two tutorials to help me get the sprite sheet animation working:

- [https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript](https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript)
- [https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3](https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3)

Both cover the use of `drawImage()` to display the correct frame from the sprite sheet based on the current frame index, which is incremented in a game loop. This approach allows for smooth animation while keeping the code organized and efficient.

`requestAnimationFrame()` is used to create a game loop that continuously updates the canvas, allowing for smooth animations of both the bird and the poop. The frame index is updated on each tick, and the correct portion of the sprite sheet is drawn based on this index.

This tutorial [https://medium.com/@westonvincze/i-challenged-myself-to-animate-a-sprite-sheet-using-only-js-and-css-3460d30cc818](https://medium.com/@westonvincze/i-challenged-myself-to-animate-a-sprite-sheet-using-only-js-and-css-3460d30cc818) (which I found later on) uses CSS keyframes to animate the sprite sheet, which is a different approach but can also be effective for simpler animations. However, I chose to stick with the canvas method for more control and flexibility in animating both the bird and the poop simultaneously.

**Drop Logic:**:

```javascript
function dropPoop() {
  const bird = document.getElementById('bird');
  const stage = document.querySelector('.stage');

  const birdRect = bird.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();

  const poop = document.createElement('div');
  poop.classList.add('poop');

  // Position under bird
  poop.style.left = birdRect.left - stageRect.left + 25 + 'px';
  poop.style.top = birdRect.top - stageRect.top + 50 + 'px';

  stage.appendChild(poop);

  // Animate downward
  let y = parseFloat(poop.style.top);

  function fall() {
    y += 4;
    poop.style.top = y + 'px';

    if (y < stage.offsetHeight) {
      requestAnimationFrame(fall);
    } else {
      poop.remove();
    }
  }

  requestAnimationFrame(fall);
}
```

#### A little bit of GSAP to top things off :

**Tweaning the fall**:

```javascript
gsap.to(poop, {
  y: stage.offsetHeight,
  duration: 1.2,
  ease: 'power1.in',
  onComplete: () => poop.remove(),
});
```

Overall, this approach allowed me to create a fun and interactive game that captures the spirit of the CC NYC announcement while utilizing tools and techniques I’m familiar with for efficient development.

Oh, and why did I do all this? I've always loved the experience on the Elegant Seagulls website, and CC NYC is all about creative coding and pushing boundaries. I could've easily created a looping announcement using p5.js or TouchDesigner, but those aren't my strengths right now. I leaned on vibe coding more than I intended, but I wanted to stick to what I know for quick iteration. Plus, I've always wanted to work with sprite sheets and canvas for a data journalism piece I've yet to tackle, and this project was the perfect chance to do that while creating something fun for the CC NYC community. Who doesn't love a good flapping bird game? It was a fun challenge to bring that concept to life while creatively incorporating the CC NYC announcement. And the fact that people can play it on the website is a nice bonus!

### Prep for Submission:

So it's all good that the game is playable on a website but the poster has to be short and tight enough for an instagram reel and post.

The trick is: don’t make it a full game. Make it a toy micro-loop.

A tight Instagram loop structure (6–8s)
0.0–1.5s: Bird cruises in Tamagotchi frame (establish vibe)
1.5–4.5s: 3 quick drops (or auto-drops in the recording) → each “cleaned” instantly becomes a text line
4.5–6.5s: Full invite visible + tiny “happy” bounce + reset fade
6.5–8.0s: Back to cruising (seamless loop point)
This reads immediately on IG.
“Caretaker cleaning poop” but still short
Make the “cleaning” instantaneous and visual, not a second mechanic.
Fast version
Press Space → poop drops → lands in a little compost tray (already positioned on the grass)
On impact: poop “pops” into a seed/sparkle and the next text chunk grows.
No dragging, no vacuum, no chase.
That keeps the caretaker idea as theme, not gameplay.

Minimum number of interactions
Aim for 3 drops max in the recorded loop:
CC NYC
Feb 27
6–8pm · Pier 57
If you want 4 beats, only do it if the pacing still fits 8s. Three is safer.
Make it feel interactive without showing a long interaction
In the screen recording, you can “perform” it quickly:
Space space space (rapid), each drop lands almost immediately (short fall distance).
Or cheat: have the recording run in “demo mode” where drops auto-fire every ~0.8s, while the live page uses Space/tap.
Practical timing choices
Bird speed: slow, continuous (doesn’t matter)
Drop fall: 0.35–0.6s
Grow text: 0.2–0.35s
Hold full message: 1.0–1.5s
Reset: 0.3–0.5s
That lands you around 6–7 seconds.

What to put in the caption
“Press Space (or tap) to clean up + grow the invite”
That signals the concept instantly.

### Future Iterations:

Important Detail
If your bird is being moved with GSAP transforms (x, y) instead of left/top, you should:
Track the bird’s position using GSAP values
Or use gsap.getProperty(bird, "x")
Otherwise your poop may not line up correctly.
This is completely doable in vanilla.
It’s basically one event listener + DOM element + animation loop.
If you want to level it up later:
Add gravity acceleration
Add splat animation
Add collision detection
Add score counter
Add limited ammo
But baseline? Very simple
