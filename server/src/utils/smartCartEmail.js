const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");

const extractEmailBody = (html = "") => {
  const source = String(html).trim();
  const styles = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join("\n");
  const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : source.replace(/<!doctype[^>]*>/gi, "").replace(/<html[^>]*>|<\/html>/gi, "").replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "").replace(/<body[^>]*>|<\/body>/gi, "");
  return { content, styles };
};

export const wrapSmartCartEmail = (html, subject = "SmartCart notification") => {
  const { content, styles } = extractEmailBody(html);
  const logoUrl = process.env.SMARTCART_EMAIL_LOGO_URL || "";
  const logo = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" width="42" height="42" alt="SmartCart" style="display:block;width:42px;height:42px;border-radius:12px;object-fit:cover;" />`
    : `<span style="display:block;width:42px;height:42px;border-radius:12px;background:#8b4a24;color:#fffaf5;font:700 17px Arial,sans-serif;line-height:42px;text-align:center;">SC</span>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
  <style>
    ${styles}
    .sc-content h1,.sc-content h2,.sc-content h3 { margin:0 0 14px; color:#2c211c; font-family:Georgia,'Times New Roman',serif; line-height:1.18; }
    .sc-content h1 { font-size:32px; }
    .sc-content h2 { font-size:28px; }
    .sc-content h3 { font-size:18px; }
    .sc-content p { margin:12px 0; color:#6f5b4f; font:15px/1.7 Arial,Helvetica,sans-serif; }
    .sc-content strong { color:#2c211c; }
    .sc-content a { color:#8b4a24; font-weight:700; }
    .sc-content table { border-color:#ead8c8 !important; }
    .sc-content th { background:#f1e2d2 !important; color:#68401f !important; }
    @media only screen and (max-width:620px) {
      .sc-shell { width:100% !important; }
      .sc-card { border-radius:0 !important; }
      .sc-content { padding:28px 20px !important; }
      .sc-header { padding:22px 20px !important; }
      .sc-content h1 { font-size:28px; }
      .sc-content h2 { font-size:24px; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f8f1e8;color:#2c211c;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(subject)} — SmartCart</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f1e8;padding:34px 12px;">
    <tr><td align="center">
      <table role="presentation" class="sc-shell" width="620" cellspacing="0" cellpadding="0" border="0" style="width:620px;max-width:620px;">
        <tr><td style="height:5px;background:#d18a52;border-radius:18px 18px 0 0;font-size:0;">&nbsp;</td></tr>
        <tr><td class="sc-header" style="padding:26px 32px;background:#8b4a24;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td width="52">${logo}</td>
            <td style="padding-left:13px;color:#fffaf5;"><div style="font:700 22px Georgia,serif;letter-spacing:.1px;">SmartCart</div><div style="margin-top:5px;color:#f2d7bd;font:11px Arial,sans-serif;letter-spacing:1.8px;text-transform:uppercase;">Shop smart &nbsp;•&nbsp; Live better</div></td>
            <td align="right" style="color:#f2d7bd;font:11px Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase;">${escapeHtml(process.env.SMARTCART_EMAIL_LABEL || "Smart update")}</td>
          </tr></table>
        </td></tr>
        <tr><td class="sc-card sc-content" style="padding:38px 32px;background:#fffaf5;border:1px solid #ead8c8;border-top:0;border-bottom:0;">
          <div style="margin-bottom:22px;color:#b15b2a;font:700 11px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">A little update from SmartCart</div>
          ${content}
        </td></tr>
        <tr><td style="padding:24px 32px;background:#f1e2d2;border-radius:0 0 18px 18px;text-align:center;color:#806d61;font:12px/1.65 Arial,sans-serif;">
          <div style="color:#8b4a24;font:700 12px Arial,sans-serif;letter-spacing:2px;">SMARTCART</div>
          <div style="margin-top:7px;">Thoughtful shopping, beautifully delivered.</div>
          <div style="margin-top:9px;color:#a28c7b;">This is an automated email. Please do not reply directly.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};
