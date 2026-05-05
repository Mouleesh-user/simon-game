# Simon

Browser implementation of the classic Simon memory game. Watch the sequence, repeat it, level up. The sequence grows by one color each round and replays from the start every time, getting faster as you climb.

**Live demo:** _add GitHub Pages URL here once deployed_

![Simon gameplay](screenshot.png)

## Play

- Click **Start** (or press any key on desktop) to begin.
- Watch the colors flash, then click them in the same order.
- Each level adds one color and slightly speeds up the playback.
- Your best run is saved locally and shown in the **Best** card.

## Stack

Vanilla HTML, CSS, and JavaScript — no framework, no build step. Tones are synthesized at runtime with the Web Audio API, so there are no audio assets in the repo. High score is persisted in `localStorage`.

## Run locally

Open `index.html` in any modern browser.

## Deploy (GitHub Pages)

1. Push this repo to GitHub.
2. Repo → **Settings** → **Pages**.
3. Source: **Deploy from a branch**, branch: `main`, folder: `/ (root)`.
4. Save. The live URL appears at the top of the Pages settings within ~1 minute.
