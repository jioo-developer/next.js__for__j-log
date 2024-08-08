export const LoginErrorHandler = (error: string) => {
  if (error.includes("auth/invalid-email")) {
    return "유효하지 않은 이메일 주소입니다.";
  } else if (error.includes("auth/user-disabled")) {
    return "사용자 계정이 비활성화되었습니다.";
  } else if (error.includes("auth/user-not-found")) {
    return "사용자를 찾을 수 없습니다.";
  } else if (error.includes("auth/wrong-password")) {
    return "잘못된 비밀번호입니다.";
  } else {
    return error;
  }
};
