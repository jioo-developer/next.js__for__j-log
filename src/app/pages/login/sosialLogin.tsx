import { onGoogle } from "@/app/_api/login/googleLogin";

const SocialLogin = () => {
  return (
    <div className="sns_sign">
      <button
        className="sns-btn"
        name="google"
        // onClick={onGoogle}
        // disabled={disabled}
        onClick={()=>onGoogle()}
      >
        <img src="/img/google.svg" alt="" />
        <figcaption className="btn_title">구글로 시작하기</figcaption>
      </button>
      <button
        className="sns-btn"
        name="facebook"
        // onClick={onFacebook}
        // disabled={disabled}
      >
        <img src="/img/facebook.svg" alt="" />
        <figcaption className="btn_title">페이스북으로 시작하기</figcaption>
      </button>
    </div>
  );
}

export default SocialLogin;