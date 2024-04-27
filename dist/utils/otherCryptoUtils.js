import crypto from 'crypto';
export const generateRandomHash = () => {
    const randomToken = crypto.randomBytes(32).toString('hex');
    return randomToken;
};
export const getPasswordResetToken = (token) => {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const passwordResetTokenExpires = Date.now() + (10 * 60 * 1000);
    return { passwordResetToken, passwordResetTokenExpires };
};
