export async function postAction<T extends Record<string, string>>(url: string, data: T) {
    return fetch(`${url}?_data=routes${encodeURIComponent(url)}`, {
        method: 'post',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: new URLSearchParams(data).toString()
    });
}