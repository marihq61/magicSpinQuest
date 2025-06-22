import { writable } from 'svelte/store';

export const credits = writable(0);
export const rollsCount = writable(0);
export const showLoginModal = writable(false);
