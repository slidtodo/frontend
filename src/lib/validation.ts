export const validateEmail = (value: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) return '';
  if (!emailRegex.test(value)) return '잘못된 이메일입니다.';
  return '';
};

export const validatePassword = (password: string, confirm: string): string => {
  if (!confirm) return '';
  if (password !== confirm) return '비밀번호가 일치하지 않습니다.';
  return '';
};
