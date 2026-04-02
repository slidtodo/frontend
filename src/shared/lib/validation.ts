export const validateEmail = (value: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) return '이메일을 입력해주세요.';
  if (!emailRegex.test(value)) return '잘못된 이메일입니다.';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) return '비밀번호를 입력해주세요.';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
  return '';
};

export const validatePasswordConfirm = (password: string, confirm: string): string => {
  if (!confirm) return '비밀번호 확인을 입력해주세요.';
  if (password !== confirm) return '비밀번호가 일치하지 않습니다.';
  return '';
};
