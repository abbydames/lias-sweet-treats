export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) return response;

    let html = await response.text();

    // Update brand language.
    html = html
      .replace(/A TOUCH OF<br>ISLAND BEAUTY/g, "A TASTE OF<br>ISLAND BEAUTY")
      .replace(/A TOUCH OF ISLAND BEAUTY<br>A WHOLE LOT OF SWEETNESS\./g, "A TASTE OF ISLAND BEAUTY<br>A WHOLE LOT OF SWEETNESS.");

    // Replace the three top benefit icons with icons that directly match the labels.
    const benefitBlock = `<section class="benefits" aria-label="Why Lia's Sweet Treats">
      <div class="benefit">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 30c0-6 4-11 10-11s10 5 10 11"/><path d="M17 30h14l-2 8H19l-2-8Z"/><path d="M19 17c0-5 3-8 5-10 2 2 5 5 5 10"/><path d="M24 7v4"/></svg>
        <span>HANDCRAFTED<br>TREATS</span>
      </div>
      <div class="benefit">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 26h18c0 7-5 12-11 12h-3c-4 0-8-5-8-12Z"/><path d="M30 26c4 0 6-2 6-5s-2-5-6-5"/><path d="M18 14c1 3 0 5-2 7"/><path d="M24 12c1 3 0 5-2 7"/><path d="M30 14c1 3 0 5-2 7"/></svg>
        <span>SMALL BATCH<br>GOODNESS</span>
      </div>
      <div class="benefit">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 11c2 0 3 3 3 5 2-2 5-2 6 0 1 2-1 4-3 5 2 0 5 1 5 4 0 2-2 4-5 4 1 2 1 5-1 6-2 1-4-1-5-3 0 2-1 5-4 5-2 0-4-2-4-5-2 1-5 1-6-1-1-2 1-4 3-5-2 0-5-1-5-4 0-2 2-4 5-4-1-2-1-5 1-6 2-1 4 1 5 3 0-2 1-4 5-4Z"/><circle cx="24" cy="24" r="2.5"/><path d="M16 39h16"/></svg>
        <span>A TASTE OF<br>ISLAND BEAUTY</span>
      </div>
    </section>`;

    html = html.replace(/<section class="benefits" aria-label="Why Lia's Sweet Treats">[\s\S]*?<\/section>/, benefitBlock);

    // Reimagine the desktop brand-value row with custom line icons that match each label.
    const oldIcons = `<div class="about-icons">
        <div class="about-icon"><span class="icon-glyph">✿</span><strong>ELEVATED<br>FLAVORS</strong></div>
        <div class="about-icon"><span class="icon-glyph">♡</span><strong>FEMININE<br>& WARM</strong></div>
        <div class="about-icon"><span class="icon-glyph">⌁</span><strong>SMALL<br>BATCH</strong></div>
        <div class="about-icon"><span class="icon-glyph">□</span><strong>GIFTABLE<br>TREATS</strong></div>
      </div>`;

    const newIcons = `<div class="about-icons about-icons-3">
        <div class="about-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 26h30"/><path d="M14 26a10 10 0 0 1 20 0"/><path d="M17 26v6h14v-6"/><path d="m31 14 2-3"/><path d="m35 17 4-1"/><path d="m33 21 3 2"/></svg><strong>ELEVATED<br>FLAVORS</strong></div>
        <div class="about-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 34h20"/><path d="M16 34v-6h16v6"/><path d="M18 28c0-5 3-8 6-10 3 2 6 5 6 10"/><path d="m32 14 2-2"/><path d="m36 18h3"/><path d="m34 22 2 2"/></svg><strong>CUSTOM<br>CREATIONS</strong></div>
        <div class="about-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="11" y="18" width="26" height="19" rx="2"/><path d="M11 24h26"/><path d="M24 18v19"/><path d="M18 18c0-4 2-7 6-7-1 2-1 4 0 7"/><path d="M30 18c0-4-2-7-6-7 1 2 1 4 0 7"/></svg><strong>GIFTABLE<br>TREATS</strong></div>
      </div>`;

    html = html.replace(oldIcons, newIcons);

    // Use the clean full-color logo in the footer so it remains legible on the plum background.
    const heroLogo = html.match(/<img class="hero-logo" src="([^"]+)" alt="Lia's Sweet Treats"/);
    if (heroLogo) {
      html = html.replace(
        /<div class="footer-logo-block"><img src="[^"]+" alt="Lia's Sweet Treats" \/><\/div>/,
        `<div class="footer-logo-block"><div class="footer-logo-pill"><img src="${heroLogo[1]}" alt="Lia's Sweet Treats" /></div></div>`
      );
    }

    // Final visual polish: remove stray desktop hibiscus, crop the tiny left artifact in the header logo,
    // style the footer logo, style custom icons, and hide the custom-cake image edge artifact.
    const patchStyles = `<style id="lia-final-polish">
      .about-floral{display:none!important}
      .about-icons-3{grid-template-columns:repeat(3,1fr)!important}
      .about-icon svg{width:34px!important;height:34px!important;stroke:var(--pink)!important;fill:none!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important;margin-bottom:7px!important}
      .brand-mark{display:inline-flex!important;align-items:center!important;overflow:hidden!important}
      .brand-mark img{transform:translateX(-3px)!important;clip-path:inset(0 0 0 3px)!important}
      .footer-logo-pill{display:inline-flex;align-items:center;justify-content:center;background:rgba(255,249,243,.97);padding:8px 18px;border-radius:999px}
      .footer-logo-pill img{filter:none!important;width:220px!important;background:transparent!important}
      .custom-cake{right:-8px!important;bottom:-3px!important;width:202px!important;height:198px!important;object-fit:cover!important;object-position:right center!important}
      @media(max-width:700px){
        .footer-logo-pill{margin:0 auto;padding:7px 14px}
        .footer-logo-pill img{width:165px!important}
        .custom-cake{right:-6px!important;bottom:-2px!important;width:114px!important;height:114px!important}
      }
    </style>`;

    html = html.replace("</head>", `${patchStyles}</head>`);

    const headers = new Headers(response.headers);
    headers.set("content-type", "text/html; charset=UTF-8");
    headers.set("cache-control", "no-cache, no-store, must-revalidate");

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};