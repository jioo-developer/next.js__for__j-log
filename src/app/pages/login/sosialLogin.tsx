import { onGoogle } from "@/app/api/login/googleLogin";
import Image from "next/image";

const SocialLogin = () => {
  return (
    <div className="sns_sign">
      <button
        className="sns-btn"
        name="google"
        // onClick={onGoogle}
        // disabled={disabled}
        onClick={() => onGoogle()}
      >
        <Image src="/img/google.svg" alt="구글 로그인" width={20} height={20} />
        <figcaption className="btn_title">구글로 시작하기</figcaption>
      </button>
      <button
        className="sns-btn"
        name="facebook"
        // onClick={onFacebook}
        // disabled={disabled}
      >
        <Image
          src="/img/facebook.svg"
          alt="페이스북 로그인"
          width={20}
          height={20}
        />
        <figcaption className="btn_title">페이스북으로 시작하기</figcaption>
      </button>
    </div>
  );
};

export default SocialLogin;
