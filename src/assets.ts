// Vite supplies '/' locally and the repository subpath for GitHub Pages.
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`
