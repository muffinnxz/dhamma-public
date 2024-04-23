export const passwordSafety = (password: string, confirmPassword: string): string => {
  if (password.length < 8) return "Password should be more than or equal to 8 characters";
  if (!/[0-9]/.test(password)) return "Password should contain at least 1 number";
  if (!/[A-Z]/.test(password)) return "Password should contain at least 1 uppercase character";
  if (!/[a-z]/.test(password)) return "Password should contain at least 1 lowercase character";
  if (password !== confirmPassword) return "Password and confirm password should be the same";
  return "Password is safe";
};

export const validEmail = (email: string): string => {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return "Invalid email format";
  return "Email is valid";
};
