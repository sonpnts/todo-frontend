export const isCloseToBottom = (target) => {
    if (target) {
        const paddingToBottom = 2;
        return target.scrollHeight - target.scrollTop <= target.clientHeight + paddingToBottom;
    }
    return false;
};
