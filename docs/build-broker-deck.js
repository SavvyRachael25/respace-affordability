// reSpace Affordability Tool — Broker Pitch Deck
// 9 slides, brand-matched, ready for Claude Design as a visual reference

const pptxgen = require("pptxgenjs");

const C = {
  navy: "1A1A2E",
  navySoft: "262640",
  coral: "E8604C",
  coralDark: "D4503F",
  sand: "F5EFE6",
  sandDeep: "ECE3D3",
  white: "FFFFFF",
  textMuted: "9CA3AF",
  textDim: "6B7280",
  sage: "7C9A7E",
};

const F = {
  display: "Arial Black",
  body: "Calibri",
};

const SCREENSHOTS_DIR = "/Users/rachael_barclay/Documents/Claude/Projects/respace-affordability/public/properties";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.title = "reSpace Affordability Tool — Broker Pitch";
pres.author = "The Savvy Digital Co.";

const W = 13.3;
const H = 7.5;

// ─────────────────────────────────────────────────────────────
// SLIDE 1 — COVER
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Left half: text
  // Ghost watermark "AFFORD" behind everything
  s.addText("AFFORD", {
    x: -0.4, y: 1.4, w: 8, h: 4,
    fontFace: F.display, fontSize: 280, bold: true,
    color: C.navySoft, charSpacing: -8,
    align: "left", valign: "top", margin: 0,
  });

  // Eyebrow
  s.addText("RESPACE · AFFORDABILITY", {
    x: 0.7, y: 0.8, w: 6, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  // Main headline (multi-line, with coral italic on key phrase)
  s.addText([
    { text: "We just built you\n", options: { color: C.white, breakLine: true } },
    { text: "a ", options: { color: C.white } },
    { text: "lead machine.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.6, w: 7.5, h: 3,
    fontFace: F.display, fontSize: 72, bold: true,
    charSpacing: -2, valign: "top",
    paraSpaceAfter: 0, margin: 0,
  });

  // Subhead
  s.addText("Pre-qualified buyer leads, suite-specific, in your inbox within seconds. Ready to share with your sphere Friday.", {
    x: 0.7, y: 5.0, w: 6.5, h: 1.4,
    fontFace: F.body, fontSize: 18,
    color: C.white, valign: "top", margin: 0,
    paraSpaceAfter: 4,
  });

  // Right half: hero photo
  s.addImage({
    path: `${SCREENSHOTS_DIR}/leschi-exterior.webp`,
    x: 7.8, y: 0, w: 5.5, h: H,
    sizing: { type: "cover", w: 5.5, h: H },
  });

  // Dark overlay on right photo (slight tint)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.8, y: 0, w: 5.5, h: H,
    fill: { color: C.navy, transparency: 30 },
    line: { type: "none" },
  });

  // Footer wordmark
  s.addText([
    { text: "re", options: { color: C.coral, bold: true } },
    { text: "Space", options: { color: C.white, bold: true } },
  ], {
    x: 0.7, y: 6.8, w: 4, h: 0.4,
    fontFace: F.body, fontSize: 18,
    margin: 0, valign: "top",
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 2 — HOW IT WORKS (two destinations)
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("HOW IT WORKS", {
    x: 0.7, y: 0.7, w: 5, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "Every lead lands ", options: { color: C.white } },
    { text: "two places.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.2, w: 12, h: 1.2,
    fontFace: F.display, fontSize: 48, bold: true,
    charSpacing: -1, margin: 0,
  });

  // Two big destination cards
  const cardY = 3.0;
  const cardH = 3.4;
  const gap = 0.4;
  const cardW = (W - 1.4 - gap) / 2;

  // Card 1 — broker email
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: cardY, w: cardW, h: cardH,
    fill: { color: C.navySoft },
    line: { color: "FFFFFF", width: 1, transparency: 90 },
  });
  s.addText("1.", {
    x: 0.95, y: cardY + 0.25, w: 1, h: 1,
    fontFace: F.display, fontSize: 64, bold: true,
    color: C.coral, margin: 0,
  });
  s.addText("To your email.", {
    x: 0.95, y: cardY + 1.2, w: cardW - 0.5, h: 0.8,
    fontFace: F.display, fontSize: 32, bold: true,
    color: C.white, margin: 0,
  });
  s.addText("Plain English. Full affordability profile attached. The suite they picked. The property they picked. Their phone number. Use it however you want.", {
    x: 0.95, y: cardY + 2.0, w: cardW - 0.5, h: 1.4,
    fontFace: F.body, fontSize: 15,
    color: C.textMuted, valign: "top", margin: 0,
    paraSpaceAfter: 6,
  });

  // Card 2 — reSpace FUB
  const c2x = 0.7 + cardW + gap;
  s.addShape(pres.shapes.RECTANGLE, {
    x: c2x, y: cardY, w: cardW, h: cardH,
    fill: { color: C.navySoft },
    line: { color: "FFFFFF", width: 1, transparency: 90 },
  });
  s.addText("2.", {
    x: c2x + 0.25, y: cardY + 0.25, w: 1, h: 1,
    fontFace: F.display, fontSize: 64, bold: true,
    color: C.coral, margin: 0,
  });
  s.addText("To reSpace's FUB.", {
    x: c2x + 0.25, y: cardY + 1.2, w: cardW - 0.5, h: 0.8,
    fontFace: F.display, fontSize: 32, bold: true,
    color: C.white, margin: 0,
  });
  s.addText("Tags, custom fields, full attribution. Leadership sees funnel volume and pipeline health. You don't have to log in. You don't have to do anything.", {
    x: c2x + 0.25, y: cardY + 2.0, w: cardW - 0.5, h: 1.4,
    fontFace: F.body, fontSize: 15,
    color: C.textMuted, valign: "top", margin: 0,
    paraSpaceAfter: 6,
  });

  // Bottom line
  s.addText("No CRM to learn. No software to install. Whatever you already use, this fits.", {
    x: 0.7, y: 6.7, w: 12, h: 0.4,
    fontFace: F.body, fontSize: 16, italic: true,
    color: C.sage, align: "center", margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 3 — THE EMAIL YOU'LL GET (mockup)
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.sand };

  s.addText("WHAT LANDS IN YOUR INBOX", {
    x: 0.7, y: 0.7, w: 10, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "The moment a buyer ", options: { color: C.navy } },
    { text: "picks a suite.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.2, w: 12, h: 1.0,
    fontFace: F.display, fontSize: 40, bold: true,
    charSpacing: -1, margin: 0,
  });

  // Email card mockup
  const cardX = 1.5, cardY = 2.6, cardW = 10.3, cardH = 4.5;
  s.addShape(pres.shapes.RECTANGLE, {
    x: cardX, y: cardY, w: cardW, h: cardH,
    fill: { color: C.white },
    line: { color: "000000", width: 1, transparency: 92 },
    shadow: { type: "outer", color: "000000", blur: 12, offset: 4, angle: 90, opacity: 0.1 },
  });

  // Subject bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: cardX, y: cardY, w: cardW, h: 0.55,
    fill: { color: C.navy },
    line: { type: "none" },
  });
  s.addText("New reSpace lead: Casey Park picked The Outlook A at The Leschi Collection", {
    x: cardX + 0.3, y: cardY + 0.08, w: cardW - 0.6, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.white, margin: 0, valign: "middle",
  });

  // Email body in two columns
  const bodyY = cardY + 0.85;
  const colW = (cardW - 0.9) / 2;

  // Left column
  s.addText([
    { text: "CONTACT\n", options: { color: C.coral, bold: true, fontSize: 11, breakLine: true } },
    { text: "Casey Park · (206) 555-1234\n", options: { color: C.navy, fontSize: 13, breakLine: true } },
    { text: "casey@example.com\n\n", options: { color: C.navy, fontSize: 13, breakLine: true } },

    { text: "PICK\n", options: { color: C.coral, bold: true, fontSize: 11, breakLine: true } },
    { text: "Property: The Leschi Collection\n", options: { color: C.navy, fontSize: 13, breakLine: true } },
    { text: "Neighborhood: Leschi, Seattle\n", options: { color: C.navy, fontSize: 13, breakLine: true } },
    { text: "Suite: The Outlook A\n", options: { color: C.navy, fontSize: 13, bold: true, breakLine: true } },
    { text: "Share price: $118,750", options: { color: C.coral, fontSize: 14, bold: true } },
  ], {
    x: cardX + 0.4, y: bodyY, w: colW, h: 3.4,
    fontFace: F.body, valign: "top", margin: 0,
    paraSpaceAfter: 2,
  });

  // Right column
  s.addText([
    { text: "AFFORDABILITY\n", options: { color: C.coral, bold: true, fontSize: 11, breakLine: true } },
    { text: "Income: $120,000  ·  Debts: $450/mo\n", options: { color: C.navy, fontSize: 13, breakLine: true } },
    { text: "Down payment: $25,000\n", options: { color: C.navy, fontSize: 13, breakLine: true } },
    { text: "Solo max home: $345,669\n", options: { color: C.navy, fontSize: 13, breakLine: true } },
    { text: "Co-owner max: $1,382,678\n\n", options: { color: C.navy, fontSize: 13, breakLine: true } },

    { text: "FIT\n", options: { color: C.coral, bold: true, fontSize: 11, breakLine: true } },
    { text: "Within reach.\n", options: { color: C.sage, fontSize: 13, bold: true, breakLine: true } },
    { text: "Solo max $345,669 covers share $118,750.", options: { color: C.navy, fontSize: 12 } },
  ], {
    x: cardX + 0.6 + colW, y: bodyY, w: colW, h: 3.4,
    fontFace: F.body, valign: "top", margin: 0,
    paraSpaceAfter: 2,
  });

  // Bottom note
  s.addText("Read it standing in line at Starbucks. Act on it without opening anything else.", {
    x: 0.7, y: 7.05, w: 12, h: 0.3,
    fontFace: F.body, fontSize: 13, italic: true,
    color: C.textDim, align: "center", margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 4 — WHY THESE LEADS ARE DIFFERENT
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("WHY THESE LEADS ARE DIFFERENT", {
    x: 0.7, y: 0.7, w: 10, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "Three reasons these beat a generic ", options: { color: C.white } },
    { text: "contact-form lead.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.2, w: 12, h: 1.0,
    fontFace: F.display, fontSize: 36, bold: true,
    charSpacing: -1, margin: 0,
  });

  // Three horizontal cards
  const items = [
    {
      n: "01",
      title: "Pre-qualified financially",
      body: "They ran their own numbers before they ever filled out a form. No tire kickers. No \"I'll have to ask my partner about budget.\"",
    },
    {
      n: "02",
      title: "Suite-specific intent",
      body: "They didn't ask \"tell me about your properties.\" They said \"I want The Outlook A at The Leschi Collection.\" Hand raised in a room of options.",
    },
    {
      n: "03",
      title: "Affordability profile attached",
      body: "Income, debts, down payment, solo max, the gap. You call ready to talk financing structures, not ready to ask intake questions.",
    },
  ];

  const cardY = 2.8;
  const cardH = 4.0;
  const cardGap = 0.3;
  const cardW = (W - 1.4 - cardGap * 2) / 3;

  items.forEach((item, i) => {
    const x = 0.7 + i * (cardW + cardGap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: C.navySoft },
      line: { color: "FFFFFF", width: 1, transparency: 90 },
    });
    s.addText(item.n, {
      x: x + 0.3, y: cardY + 0.3, w: 1.5, h: 0.7,
      fontFace: F.display, fontSize: 32, bold: true,
      color: C.coral, margin: 0,
    });
    s.addText(item.title, {
      x: x + 0.3, y: cardY + 1.2, w: cardW - 0.6, h: 0.9,
      fontFace: F.display, fontSize: 22, bold: true,
      color: C.white, margin: 0, valign: "top",
    });
    s.addText(item.body, {
      x: x + 0.3, y: cardY + 2.2, w: cardW - 0.6, h: 1.7,
      fontFace: F.body, fontSize: 14,
      color: C.textMuted, valign: "top", margin: 0,
      paraSpaceAfter: 6,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 5 — WHO YOU'LL SEND THIS TO (sphere)
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.sand };

  s.addText("FRIDAY, THIS IS IN YOUR HANDS", {
    x: 0.7, y: 0.55, w: 10, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "Your sphere is ", options: { color: C.navy } },
    { text: "the launch.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.0, w: 12, h: 0.9,
    fontFace: F.display, fontSize: 38, bold: true,
    charSpacing: -1, margin: 0,
  });

  s.addText("Read this list slowly. You'll recognize the people.", {
    x: 0.7, y: 1.95, w: 12, h: 0.4,
    fontFace: F.body, fontSize: 16, italic: true,
    color: C.textDim, margin: 0,
  });

  const personas = [
    { label: "Your kids", body: "Your 28-year-old in Bellevue making $75K who's stopped opening real estate emails. They'll open this one." },
    { label: "Your coworkers", body: "Mortgage brokers, loan officers, title reps, appraisers. They watch buyers walk away every week." },
    { label: "The endless house-hunters", body: "The couple who's toured 22 houses in 18 months. They want to stop. They want to move in." },
    { label: "Your sister, age 35", body: "Renting in Seattle. Doesn't want to leave. The Conservatory at Leschi: $159,500." },
    { label: "The teacher at the bake sale", body: "Thinking about leaving Seattle for Tacoma to afford anything. She doesn't have to leave." },
    { label: "Essential workers", body: "Nurses, firefighters, cops, social workers priced out of the cities they serve. This is a path." },
    { label: "Your gym friend", body: "Anyone who's said \"I gave up on owning\" or \"we're priced out.\" Activation waiting." },
    { label: "Former clients", body: "The 2022 file of buyers who walked away. The math has changed. The conversation is different now." },
  ];

  // 2x4 grid
  const gridY = 2.6;
  const gridH = 4.4;
  const colCount = 4;
  const rowCount = 2;
  const cellGap = 0.18;
  const cellW = (W - 1.4 - cellGap * (colCount - 1)) / colCount;
  const cellH = (gridH - cellGap * (rowCount - 1)) / rowCount;

  personas.forEach((p, i) => {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const x = 0.7 + col * (cellW + cellGap);
    const y = gridY + row * (cellH + cellGap);

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cellW, h: cellH,
      fill: { color: C.white },
      line: { color: C.coral, width: 0.75, transparency: 75 },
    });
    s.addText(p.label, {
      x: x + 0.18, y: y + 0.18, w: cellW - 0.36, h: 0.55,
      fontFace: F.display, fontSize: 15, bold: true,
      color: C.navy, margin: 0, valign: "top",
    });
    s.addText(p.body, {
      x: x + 0.18, y: y + 0.78, w: cellW - 0.36, h: cellH - 0.95,
      fontFace: F.body, fontSize: 11,
      color: C.textDim, valign: "top", margin: 0,
      paraSpaceAfter: 4,
    });
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 6 — THE GROWTH LOOP (4 buyers per house)
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Left side: text
  s.addText("THE GROWTH LOOP", {
    x: 0.7, y: 0.7, w: 6, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "One lead =\n", options: { color: C.white, breakLine: true } },
    { text: "four closes.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.3, w: 6.8, h: 2.5,
    fontFace: F.display, fontSize: 60, bold: true,
    charSpacing: -2, margin: 0, valign: "top",
    paraSpaceAfter: 0,
  });

  s.addText("Co-homeownership has a structural advantage over single-family resale. Every closed property has four buyers, not one.", {
    x: 0.7, y: 4.2, w: 6.8, h: 1.4,
    fontFace: F.body, fontSize: 17,
    color: C.textMuted, valign: "top", margin: 0,
    paraSpaceAfter: 4,
  });

  s.addText("The thank-you page invites every buyer to share the calculator. The friend's lead carries the property AND the suite. You see the group forming in real time.", {
    x: 0.7, y: 5.7, w: 6.8, h: 1.6,
    fontFace: F.body, fontSize: 14, italic: true,
    color: C.sage, valign: "top", margin: 0,
    paraSpaceAfter: 4,
  });

  // Right side: photo of co-owners celebrating
  s.addImage({
    path: "https://d2xsxph8kpxj0f.cloudfront.net/310519663333310015/UUfDD9B2a3czptPTkkTF8D/hero_kitchen_v2_e0efdd3a.jpg",
    x: 8.0, y: 0, w: 5.3, h: H,
    sizing: { type: "cover", w: 5.3, h: H },
  });
  // Subtle dark overlay on photo
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.0, y: 0, w: 5.3, h: H,
    fill: { color: C.navy, transparency: 50 },
    line: { type: "none" },
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 7 — ATTRIBUTION (source → broker → close)
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.sand };

  s.addText("ATTRIBUTION", {
    x: 0.7, y: 0.7, w: 6, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "You get credit. ", options: { color: C.navy } },
    { text: "Forever.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.2, w: 12, h: 1.0,
    fontFace: F.display, fontSize: 40, bold: true,
    charSpacing: -1, margin: 0,
  });

  // Flow: 3 boxes with arrows
  const flowY = 3.0;
  const flowH = 2.0;
  const arrowW = 0.6;
  const boxW = (W - 1.4 - arrowW * 2) / 3;
  const stages = [
    { eyebrow: "Source", text: "The affordability calculator. Permanent tag on every lead." },
    { eyebrow: "Broker", text: "You own the lead the moment it's assigned. Lands in your inbox." },
    { eyebrow: "Close", text: "Source rides through the deal. Credit traces back to you. Marketing ROI traces back to the calc." },
  ];

  stages.forEach((stage, i) => {
    const x = 0.7 + i * (boxW + arrowW);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: flowY, w: boxW, h: flowH,
      fill: { color: C.white },
      line: { color: C.coral, width: 1.5 },
    });
    s.addText(stage.eyebrow.toUpperCase(), {
      x: x + 0.25, y: flowY + 0.25, w: boxW - 0.5, h: 0.4,
      fontFace: F.body, fontSize: 11, bold: true,
      color: C.coral, charSpacing: 5, margin: 0,
    });
    s.addText(stage.text, {
      x: x + 0.25, y: flowY + 0.75, w: boxW - 0.5, h: flowH - 1.0,
      fontFace: F.body, fontSize: 14,
      color: C.navy, valign: "top", margin: 0,
      paraSpaceAfter: 4,
    });
    // Arrow
    if (i < stages.length - 1) {
      const ax = x + boxW + 0.05;
      s.addText("→", {
        x: ax, y: flowY + 0.55, w: arrowW - 0.1, h: 0.9,
        fontFace: F.display, fontSize: 40, bold: true,
        color: C.coral, align: "center", valign: "middle", margin: 0,
      });
    }
  });

  // Bottom paragraph
  s.addText([
    { text: "Sphere-share chain stays traceable. ", options: { color: C.navy, bold: true } },
    { text: "When your kid forwards to a friend, and the friend buys, the chain comes back to you. Personalized share links carry your name through every step.", options: { color: C.textDim } },
  ], {
    x: 0.7, y: 5.8, w: 12, h: 1.2,
    fontFace: F.body, fontSize: 16,
    valign: "top", margin: 0,
    paraSpaceAfter: 4,
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 8 — FRIDAY LAUNCH TIMELINE
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addText("THE FRIDAY LAUNCH", {
    x: 0.7, y: 0.7, w: 6, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "You go first. ", options: { color: C.white } },
    { text: "A week ahead.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.2, w: 12, h: 1.0,
    fontFace: F.display, fontSize: 40, bold: true,
    charSpacing: -1, margin: 0,
  });

  // Three timeline pillars
  const pillars = [
    { day: "FRIDAY", title: "You get the link.", body: "Clean URL with the calculator live. Public funnel is still off. Your sphere goes first." },
    { day: "ONE WEEK", title: "Your runway.", body: "Forward to anyone in your sphere. Texts, DMs, group chats, \"hey haven't talked in a while\" emails. Every send is a potential lead." },
    { day: "PUBLIC LAUNCH", title: "The funnel turns on.", body: "Calculator becomes a primary CTA on respace.co/buyers. Email blast goes out. Social posts run. You're already ahead." },
  ];

  const pY = 3.0;
  const pH = 3.6;
  const pGap = 0.4;
  const pW = (W - 1.4 - pGap * 2) / 3;

  pillars.forEach((p, i) => {
    const x = 0.7 + i * (pW + pGap);

    // Day chip
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: pY, w: pW, h: 0.7,
      fill: { color: C.coral },
      line: { type: "none" },
    });
    s.addText(p.day, {
      x: x + 0.2, y: pY + 0.1, w: pW - 0.4, h: 0.55,
      fontFace: F.body, fontSize: 14, bold: true,
      color: C.white, charSpacing: 6, margin: 0, valign: "middle",
    });

    // Card body
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: pY + 0.7, w: pW, h: pH - 0.7,
      fill: { color: C.navySoft },
      line: { color: "FFFFFF", width: 1, transparency: 90 },
    });
    s.addText(p.title, {
      x: x + 0.3, y: pY + 1.0, w: pW - 0.6, h: 0.8,
      fontFace: F.display, fontSize: 22, bold: true,
      color: C.white, margin: 0, valign: "top",
    });
    s.addText(p.body, {
      x: x + 0.3, y: pY + 1.9, w: pW - 0.6, h: pH - 2.1,
      fontFace: F.body, fontSize: 14,
      color: C.textMuted, valign: "top", margin: 0,
      paraSpaceAfter: 6,
    });
  });

  s.addText("You start a week ahead of the open market. Your sphere is your warm list. You'll close some of them inside two weeks.", {
    x: 0.7, y: 6.85, w: 12, h: 0.4,
    fontFace: F.body, fontSize: 15, italic: true,
    color: C.sage, align: "center", margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 9 — THE SINGLE ASK
// ─────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Big ghost watermark
  s.addText("YES", {
    x: 1.5, y: 0.8, w: 12, h: 5,
    fontFace: F.display, fontSize: 400, bold: true,
    color: C.navySoft, charSpacing: -12,
    align: "left", valign: "top", margin: 0,
  });

  s.addText("THE SINGLE ASK", {
    x: 0.7, y: 0.8, w: 6, h: 0.4,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.coral, charSpacing: 6, margin: 0,
  });

  s.addText([
    { text: "Confirm the\n", options: { color: C.white, breakLine: true } },
    { text: "24-hour SLA.", options: { color: C.coral, italic: true } },
  ], {
    x: 0.7, y: 1.6, w: 12, h: 3.0,
    fontFace: F.display, fontSize: 92, bold: true,
    charSpacing: -3, margin: 0, valign: "top",
    paraSpaceAfter: 0,
  });

  s.addText("The tool promises buyers a broker reaches out within 24 hours. We need that promise honored, especially for sphere leads where the buyer trusted YOU enough to open the email.", {
    x: 0.7, y: 5.0, w: 9, h: 1.5,
    fontFace: F.body, fontSize: 18,
    color: C.textMuted, valign: "top", margin: 0,
    paraSpaceAfter: 4,
  });

  // Coral CTA block bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.7, y: 6.6, w: 12, h: 0.65,
    fill: { color: C.coral },
    line: { type: "none" },
  });
  s.addText("Friday, you get the link. Your sphere becomes the launch.", {
    x: 0.7, y: 6.6, w: 12, h: 0.65,
    fontFace: F.body, fontSize: 17, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });
}

// ─────────────────────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────────────────────
pres.writeFile({
  fileName: "/Users/rachael_barclay/Downloads/respace-affordability-broker-pitch.pptx"
}).then((f) => console.log("✓ Wrote:", f));
