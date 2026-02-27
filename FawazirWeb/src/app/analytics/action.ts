'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME } from './constants';

export async function logoutAnalytics() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect('/login');
}
