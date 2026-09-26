import { auth } from './firebase/client';

/** fetch que anexa o ID token do Firebase (quando o usuário está logado), pra contar o uso por conta em vez de por IP. */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  if (auth?.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}
