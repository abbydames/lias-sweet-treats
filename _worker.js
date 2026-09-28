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

    // Reimagine the desktop brand-value row and remove duplicated small-batch language.
    const oldIcons = `<div class="about-icons">
        <div class="about-icon"><span class="icon-glyph">✿</span><strong>ELEVATED<br>FLAVORS</strong></div>
        <div class="about-icon"><span class="icon-glyph">♡</span><strong>FEMININE<br>& WARM</strong></div>
        <div class="about-icon"><span class="icon-glyph">⌁</span><strong>SMALL<br>BATCH</strong></div>
        <div class="about-icon"><span class="icon-glyph">□</span><strong>GIFTABLE<br>TREATS</strong></div>
      </div>`;

    const newIcons = `<div class="about-icons about-icons-3">
        <div class="about-icon"><span class="icon-glyph">✿</span><strong>ELEVATED<br>FLAVORS</strong></div>
        <div class="about-icon"><span class="icon-glyph">◇</span><strong>CUSTOM<br>CREATIONS</strong></div>
        <div class="about-icon"><span class="icon-glyph">□</span><strong>GIFTABLE<br>TREATS</strong></div>
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
    // and style the replacement footer logo.
    const patchStyles = `<style id="lia-final-polish">
      .about-floral{display:none!important}
      .about-icons-3{grid-template-columns:repeat(3,1fr)!important}
      .brand-mark{display:inline-flex!important;align-items:center!important;overflow:hidden!important}
      .brand-mark img{transform:translateX(-3px)!important;clip-path:inset(0 0 0 3px)!important}
      .footer-logo-pill{display:inline-flex;align-items:center;justify-content:center;background:rgba(255,249,243,.97);padding:8px 18px;border-radius:999px}
      .footer-logo-pill img{filter:none!important;width:220px!important;background:transparent!important}
      @media(max-width:700px){
        .footer-logo-pill{margin:0 auto;padding:7px 14px}
        .footer-logo-pill img{width:165px!important}
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