// Cloudflare Pages _worker.js pour Next.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Gérer les routes API
    if (url.pathname.startsWith('/api/')) {
      // Pour Cloudflare, on pourrait utiliser des Functions
      // Mais pour simplifier, on redirige vers le serveur Next.js
      return new Response('API route - Not implemented on Cloudflare Pages', {
        status: 501,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Pour les pages statiques, laisser Cloudflare Pages servir les fichiers
    return env.ASSETS.fetch(request);
  }
};