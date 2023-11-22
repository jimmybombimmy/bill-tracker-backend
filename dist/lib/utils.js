export const hexCheck = (str) => {
    const regexp = /^[0-9a-fA-F]+$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
};
