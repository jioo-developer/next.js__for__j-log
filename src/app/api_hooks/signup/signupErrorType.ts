export const signupErrorHandler = (error: string) => {
  if (error.includes(" (auth/invalid-email).")) {
    return "올바른 이메일 형식이 아닙니다.";
  } else if (error.includes("(auth/weak-password).")) {
    return "비밀번호가 너무짧습니다. 8자 이상이여야 합니다";
  } else if (error.includes("(auth/email-already-in-use).")) {
    return "이미 사용중인 이메일입니다.";
  } else {
    return "오류 입니다, 제작자에게 문의 해주세요.";
  }
};
