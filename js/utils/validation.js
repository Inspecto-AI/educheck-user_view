export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}; 