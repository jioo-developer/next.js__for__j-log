import { authService,db, } from "@/app/Firebase";
import {  doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup,GoogleAuthProvider } from "firebase/auth";

  export async function onGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(authService, provider);
    const userID = result.user.uid
    const userName = result.user.displayName;

    if (result.user) {
      if (!isStepVerification(userID)) {
        const password = window.prompt("회원 탈퇴에 사용 될 비밀번호를 입력해주세요.");
        password ?  twoStepVerification(userID,userName,parseInt(password))  : authService.signOut();
      } else {
        window.location.href = "/"
      }
    } else {
      window.alert("로그인 정보를 불러 올 수 없습니다.");
    }
    // 함수 끝
  }

  
  async function isStepVerification(userId:string) {
    const docRef = await doc(db,"nickname",userId);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      return docSnap.data();
    }
  }


  async function twoStepVerification (id:string, nickname:string | null, password: number) {
    try { 
       await setDoc(doc(db,"nickname",id), {
        id:id,
        password : password,
        nickname:nickname ? nickname : id 
        // 닉네임을 넣는 이유는 해당 uid가 어떤 유저의 것인지 알기 위함
        // 만약 nickname이 null 일 때 uid를 대신 넣어주기
       }).then(()=> window.location.href ="/") 
    } catch (error){
        console.log(error)
    }
  }

  