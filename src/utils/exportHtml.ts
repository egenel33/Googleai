import { Website, BlockData, AgencyConfig } from '../types';

export function generateStaticHtml(website: Website, agency: AgencyConfig): string {
  const blocksHtml = website.blocks
    .map((block) => renderBlockToHtml(block, website))
    .join('\n');

  const watermarkHtml = agency.removePlatformBranding
    ? ''
    : `
      <div style="background:#0f172a;color:#94a3b8;font-size:12px;text-align:center;padding:12px 16px;border-top:1px solid #1e293b;">
        <span>Tasarım ve Altyapı: <strong>${escapeHtml(agency.name)}</strong></span>
        ${agency.domain ? ` · <a href="https://${escapeHtml(agency.domain)}" style="color:#38bdf8;text-decoration:none;">${escapeHtml(agency.domain)}</a>` : ''}
      </div>
    `;

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(website.title)}</title>
  <meta name="description" content="${escapeHtml(website.blocks[1]?.description || website.title)}">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: '${website.theme.fontFamily || 'Plus Jakarta Sans'}', system-ui, sans-serif;
      color: ${website.theme.textColor || '#0f172a'};
      background-color: ${website.theme.backgroundColor || '#ffffff'};
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="antialiased">
  ${blocksHtml}
  ${watermarkHtml}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderBlockToHtml(block: BlockData, site: Website): string {
  const bg = block.style.bgColor || '#ffffff';
  const text = block.style.textColor || '#0f172a';
  const py =
    block.style.paddingY === 'compact'
      ? 'py-8'
      : block.style.paddingY === 'spacious'
      ? 'py-24'
      : 'py-16';

  switch (block.type) {
    case 'header':
      return `
      <header style="background-color: ${bg}; color: ${text};" class="sticky top-0 z-50 px-6 py-4 border-b border-black/10">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
          <a href="#" class="text-xl font-bold tracking-tight">${escapeHtml(block.title)}</a>
          <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
            ${(block.items || [])
              .map(
                (item: any) =>
                  `<a href="${escapeHtml(item.href || '#')}" class="hover:opacity-75 transition-opacity">${escapeHtml(item.label)}</a>`
              )
              .join('')}
          </nav>
          ${
            block.buttonText
              ? `<a href="${escapeHtml(block.buttonLink || '#contact')}" class="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">${escapeHtml(block.buttonText)}</a>`
              : ''
          }
        </div>
      </header>`;

    case 'hero':
      return `
      <section style="background-color: ${bg}; color: ${text};" class="${py} px-6 relative overflow-hidden">
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            ${
              block.subtitle
                ? `<p class="text-xs uppercase tracking-widest font-semibold text-blue-600 mb-3">${escapeHtml(block.subtitle)}</p>`
                : ''
            }
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">${escapeHtml(block.title)}</h1>
            ${
              block.description
                ? `<p class="text-lg opacity-85 leading-relaxed mb-8 max-w-xl">${escapeHtml(block.description)}</p>`
                : ''
            }
            <div class="flex flex-wrap gap-4 items-center">
              ${
                block.buttonText
                  ? `<a href="${escapeHtml(block.buttonLink || '#')}" class="px-6 py-3.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all">${escapeHtml(block.buttonText)}</a>`
                  : ''
              }
              ${
                block.secondaryButtonText
                  ? `<a href="${escapeHtml(block.secondaryButtonLink || '#')}" class="px-6 py-3.5 text-sm font-semibold rounded-xl border border-current hover:bg-black/5 transition-all">${escapeHtml(block.secondaryButtonText)}</a>`
                  : ''
              }
            </div>
          </div>
          ${
            block.imageUrl
              ? `<div class="rounded-2xl overflow-hidden shadow-2xl border border-black/10">
                  <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)}" class="w-full h-auto object-cover max-h-[480px]">
                </div>`
              : ''
          }
        </div>
      </section>`;

    case 'features':
      return `
      <section style="background-color: ${bg}; color: ${text};" class="${py} px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center max-w-2xl mx-auto mb-16">
            ${block.subtitle ? `<p class="text-xs uppercase tracking-widest font-semibold text-blue-600 mb-2">${escapeHtml(block.subtitle)}</p>` : ''}
            <h2 class="text-3xl font-bold tracking-tight mb-4">${escapeHtml(block.title)}</h2>
            ${block.description ? `<p class="text-sm opacity-80">${escapeHtml(block.description)}</p>` : ''}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${(block.items || [])
              .map(
                (item: any) => `
              <div class="p-8 rounded-2xl bg-white/70 border border-black/10 hover:shadow-lg transition-shadow">
                <h3 class="text-xl font-bold mb-3">${escapeHtml(item.title)}</h3>
                <p class="text-sm opacity-80 leading-relaxed">${escapeHtml(item.desc)}</p>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;

    case 'about':
      return `
      <section style="background-color: ${bg}; color: ${text};" class="${py} px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          ${
            block.imageUrl
              ? `<div class="rounded-2xl overflow-hidden border border-black/10 shadow-lg">
                  <img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)}" class="w-full h-auto object-cover max-h-[450px]">
                </div>`
              : ''
          }
          <div>
            ${block.subtitle ? `<p class="text-xs uppercase tracking-widest font-semibold text-blue-600 mb-2">${escapeHtml(block.subtitle)}</p>` : ''}
            <h2 class="text-3xl font-bold tracking-tight mb-6">${escapeHtml(block.title)}</h2>
            <p class="text-base opacity-85 leading-relaxed mb-8">${escapeHtml(block.description || '')}</p>
            <div class="grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              ${(block.items || [])
                .map(
                  (item: any) => `
                <div>
                  <div class="text-2xl font-extrabold text-blue-600">${escapeHtml(item.metric)}</div>
                  <div class="text-xs opacity-75 mt-1">${escapeHtml(item.label)}</div>
                </div>`
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>`;

    case 'gallery':
      return `
      <section style="background-color: ${bg}; color: ${text};" class="${py} px-6">
        <div class="max-w-6xl mx-auto">
          <div class="text-center max-w-2xl mx-auto mb-12">
            ${block.subtitle ? `<p class="text-xs uppercase tracking-widest font-semibold text-blue-600 mb-2">${escapeHtml(block.subtitle)}</p>` : ''}
            <h2 class="text-3xl font-bold tracking-tight mb-4">${escapeHtml(block.title)}</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${(block.items || [])
              .map(
                (item: any) => `
              <div class="group rounded-2xl overflow-hidden border border-black/10 bg-white">
                <div class="aspect-video overflow-hidden">
                  <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-5">
                  <span class="text-xs text-blue-600 font-semibold uppercase tracking-wider">${escapeHtml(item.category || '')}</span>
                  <h4 class="text-lg font-bold mt-1">${escapeHtml(item.title)}</h4>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;

    case 'contact':
      return `
      <section id="contact" style="background-color: ${bg}; color: ${text};" class="${py} px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            ${block.subtitle ? `<p class="text-xs uppercase tracking-widest font-semibold text-blue-400 mb-2">${escapeHtml(block.subtitle)}</p>` : ''}
            <h2 class="text-3xl font-bold tracking-tight mb-4">${escapeHtml(block.title)}</h2>
            <p class="text-base opacity-80 mb-8 leading-relaxed">${escapeHtml(block.description || '')}</p>
            <div class="space-y-4 text-sm">
              ${block.contactPhone ? `<div class="flex items-center gap-3"><span>📞 ${escapeHtml(block.contactPhone)}</span></div>` : ''}
              ${block.contactEmail ? `<div class="flex items-center gap-3"><span>✉️ ${escapeHtml(block.contactEmail)}</span></div>` : ''}
              ${block.contactAddress ? `<div class="flex items-center gap-3"><span>📍 ${escapeHtml(block.contactAddress)}</span></div>` : ''}
            </div>
          </div>
          <form class="bg-white/10 p-8 rounded-2xl border border-white/10 space-y-4" onsubmit="event.preventDefault(); alert('Mesajınız başarıyla iletildi!');">
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2 font-medium opacity-80">Ad Soyad</label>
              <input type="text" required class="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400" placeholder="Adınız Soyadınız">
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2 font-medium opacity-80">E-Posta</label>
              <input type="email" required class="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400" placeholder="ornek@alanadi.com">
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2 font-medium opacity-80">Mesajınız</label>
              <textarea rows="4" required class="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400" placeholder="Hizmet talebinizi açıklayınız..."></textarea>
            </div>
            <button type="submit" class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">${escapeHtml(block.buttonText || 'Gönder')}</button>
          </form>
        </div>
      </section>`;

    case 'footer':
      return `
      <footer style="background-color: ${bg}; color: ${text};" class="${py} px-6 border-t border-black/10">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p class="font-semibold">${escapeHtml(block.title)}</p>
          <p class="opacity-75">${escapeHtml(block.description || '')}</p>
        </div>
      </footer>`;

    default:
      return `<section class="py-12 px-6 text-center"><p class="text-gray-500">${escapeHtml(block.title)}</p></section>`;
  }
}

export function downloadHtmlFile(website: Website, agency: AgencyConfig) {
  const content = generateStaticHtml(website, agency);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${website.slug || 'website'}-index.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
