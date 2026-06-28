import { getCookie } from './auth';
import { apiBase } from '../config/public';

export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getCookie('access_token');

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        ...(options.headers as Record<string, string>),
    };

    if (options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${apiBase}${path}`, { ...options, headers });

    if (!res.ok) throw new Error(`${res.status}`);

    const text = await res.text();
    return text ? JSON.parse(text) : undefined;
}
