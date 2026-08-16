export const environment = {
  production: true,
  // Caminhos relativos de propósito: o Traefik serve o frontend em / e roteia
  // /api para o backend e /lab para os desafios no mesmo domínio. Assim o
  // mesmo bundle funciona em qualquer host, sem rebuild por ambiente.
  apiUrl: '/api',
  labBaseUrl: '/lab',
};
