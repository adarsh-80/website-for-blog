# Instinct — The Living Book

This package is an isolated replacement for `pages/instinct/`.

## What changed
- Rebuilt the page around the supplied dark, green-tinted editorial reference image.
- Added the woman from the user-provided reference screenshot as a local hero image asset (`assets/hero-girl.jpg`).
- Expanded the scientific content using the supplied **Executive Summary.pdf** and **Executive Summary (1).pdf** research reports.
- Added the substantive research areas in those reports: definition/taxonomy, history, evolution, genetics/development, neural circuitry, hormones, comparative ethology, human instincts, decision-making, plasticity/override, culture, clinical relevance, experimental methods, AI models, philosophical distinctions, open questions and references.
- Added the report-proposed interactive concepts: page index/search, research timeline, neural circuit diagram, fear-intensity demo and an artificial-instinct visualization.
- Kept text contrast stable during scrolling; there is no scroll-based text dimming.
- No global website files are changed by this package.

## Install
Replace only:

`pages/instinct/`

with this folder. The expected structure is:

```text
pages/
└── instinct/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── README.md
    └── assets/
        └── hero-girl.jpg
```

Open:
`pages/instinct/index.html`

## Note on the hero image
The hero image is a crop of the screenshot supplied in the conversation, used because the request specifically asked for the girl/visual treatment from that reference. If the original image is available under a license you control, replace `assets/hero-girl.jpg` with the original higher-resolution source while keeping the filename.

## Scientific sourcing
The page preserves the terminology and framing of the supplied research reports. It does not silently turn the reports' speculative AI analogies or contested human-instinct claims into settled biological facts.
