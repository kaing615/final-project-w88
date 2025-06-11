const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params) => {
    const qs = new URLSearchParams(params);
    let url = `${baseUrl}`;
    // Thêm dấu "/" nếu thiếu
    if (!baseUrl.endsWith('/') && !endpoint.startsWith('/')) {
        url += '/';
    }
    url += endpoint;
    url += `?api_key=${key}`;
    if (qs.toString()) url += `&${qs}`;
    return url;
};

export default { getUrl };