/**
 * Cloudflare Pages middleware：把預設的 <project>.pages.dev 網址 301 到正式網址。
 *
 * Cloudflare 的 *.pages.dev 網址掛了正式網域後不會自動關掉，整站照常可開，
 * AdSense 報表上會出現它的曝光。只攔專案本身的網址，分支預覽（xxxx.<project>.pages.dev）不攔。
 */
export const onRequest = async (context: { request: Request; next: () => Promise<Response> }): Promise<Response> => {
  const url = new URL(context.request.url);
  if (url.hostname === 'ft-pdf.pages.dev') {
    url.hostname = 'pdf.freetoolkit.cc';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
};
