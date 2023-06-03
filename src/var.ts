export const BASE_URL = (() => {
    let url = process.env.BASE_URL ?? '/';
    if(url.endsWith('/')) url = url.slice(0, -1);
    return url;
})();