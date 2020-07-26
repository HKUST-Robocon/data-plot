export const isAPIAvailable = () => {
    if ('serial' in navigator)
        return true;
    return false;
}