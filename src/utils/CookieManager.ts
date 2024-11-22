export function createCookie(key: string, value: string, secure: boolean): void{
    document.cookie = `${key}=${value}; SameSite=Lax; ${secure ? "Secure" : ""}`;
}

/**
 * Find cookie from string using regex. <br/>
 * Cookie string looks like this: "param1=value1; token=...; param2=value2; "
 * @param key by which key find cookie
 */
export function getCookie(key: string): string | undefined {
    let b = RegExp("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)").exec(document.cookie);
    return b ? b.pop() : "";
}

/**
 * Deletes cookie by finding it by its name and replacing it with empty string.
 * @param key token name
 * @returns true if successful, otherwise false.
 */
export function deleteCookie(key: string): boolean {
    const cookieSeparator = "; ";
    const cookieString = document.cookie
        .split(cookieSeparator)
        .find((row) => row.startsWith(key + "="));
    if (cookieString) {
        document.cookie = cookieString.replace(
            /=.*/, // Matches everything after the "="
            "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        );
        return true;
    }
    return false;
}
