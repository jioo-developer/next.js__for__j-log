"use client";
import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHooks";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { timeData } from "@/app/handler/commonHandler";
import {
  CreateUrl,
  ImageDeleteHandler,
  LoadImageHandler,
} from "@/app/handler/detail/crud/PostCreateHandler";
import { createPageId } from "@/app/handler/detail/pageInfoHandler";
import { pageInfoStore } from "@/app/store/common";
import { Input } from "@/stories/atoms/Input";
import { User } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

const EditorPage = () => {
  const { data: user } = useUserQueryHook();
  const { pgId: pageInfo, editMode } = pageInfoStore();
  const { pageData } = useDetailQueryHook(pageInfo);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [previewImg, setPreview] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!editMode) {
      pageInfoStore.setState({ pgId: createPageId() });
      //edit mode가 false이기 때문에 pageid를 새로 구성 = pageData가 없음
    } else {
      // edit mode가 true이기 때문에 이미 pageData가 있음
      const data = pageData as FirebaseData;
      // 그래서 거짓의 값이 없을 경우 타입 단언 적용
      setTitle(data.title);
      // 이전에 있는 제목
      setText(data.text);
      // 이전에 있는 내용
      const imageUrl = (data as FirebaseData).url;
      setPreview(imageUrl);
      // 이전에 있는 이미지
    }
  }, [editMode, pageData]);

  async function createHandler() {
    const content = {
      title,
      text,
      url: CreateUrl({ image: previewImg, file, isEdit: editMode }),
    };
    if (editMode) {
      const obj = { ...pageData };
      Object.assign(content, obj);
    } else {
      const currentUser = user as User;
      const addContent = {
        user: currentUser.displayName,
        writer: currentUser.uid,
        date: `${timeData.year}년 ${timeData.month}월 ${timeData.day}일`,
        favorite: 0,
        pageId: pageInfo,
        profile: currentUser.photoURL,
        timeStamp: serverTimestamp(),
        fileName: file.map((value: File) => value.name),
      };
      Object.assign(content, addContent);
    }
  }

  return (
    <div className="upload">
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (title !== "" && text !== "") {
            createHandler();
          }
        }}
      >
        <Input type="text" value={title} setstate={setTitle} />
        <div className="textarea">
          <ReactTextareaAutosize
            cacheMeasurements
            onHeightChange={(height) => {}}
            className="text"
            autoComplete="off"
            defaultValue={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setText(e.target.value);
            }}
          />
          <figure>
            {previewImg.length > 0 &&
              previewImg.map((url, index) => (
                <div key={index}>
                  <button
                    type="button"
                    className="preview_delete"
                    onClick={() => {
                      const array = { image: previewImg, file: file };
                      ImageDeleteHandler({ array, fileIndex: index });
                    }}
                  >
                    <img src="./img/close.png" alt="" />
                  </button>
                  <img src={url} alt="" className="att" key={index} />
                </div>
              ))}
          </figure>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-form"
          id="image"
          onChange={async (e) => {
            const { result, files } = await LoadImageHandler(e);
            if (result) {
              setPreview(result);
              setFile(files);
            }
          }}
        />
        <label htmlFor="image" className="Attachment image-att">
          이미지를 담아주세요
        </label>

        <div className="bottom_wrap">
          <div className="exit" onClick={() => router.back()}>
            ← &nbsp;나가기
          </div>
          <div className="cancel_wrap">
            <button type="submit" className="post">
              글작성
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditorPage;
