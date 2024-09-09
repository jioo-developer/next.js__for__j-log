"use client";
import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHook";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import {
  CreateImgUrl,
  ImageDeleteHandler,
  LoadImageHandler,
} from "@/app/handler/detail/crud/imageCrudHandler";
import setDataHandler from "@/app/handler/detail/crud/setDataHandler";
import useCreateMutation from "@/app/handler/detail/crud/useMutationHandler";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { pageInfoStore } from "@/app/store/common";
import { Input } from "@/stories/atoms/Input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

const EditorPage = () => {
  const { data: user } = useUserQueryHook();
  const { pgId: pageInfo, editMode } = pageInfoStore();
  const { pageData } = useDetailQueryHook(pageInfo);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [previewImg, setPreview] = useState<string[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const [priorty, setPriorty] = useState(false);

  const router = useRouter();
  const createId = useCreateId();
  const postMutate = useCreateMutation();

  useEffect(() => {
    if (!editMode) {
      pageInfoStore.setState({ pgId: createId });
      //edit mode가 false이기 때문에 pageid를 새로 구성 = pageData가 없음
    } else {
      // edit mode가 true이기 때문에 이미 pageData가 있음
      const oldData = pageData as FirebaseData;
      // 그래서 거짓의 값이 없을 경우 타입 단언 적용
      setTitle(oldData.title);
      // 이전에 있는 제목
      setText(oldData.text);
      // 이전에 있는 내용
      const imageUrl = oldData.url;
      setPreview(imageUrl);
      // 이전에 있는 이미지
    }
  }, [editMode, pageData]);

  async function CreateHandler() {
    const content = {
      title,
      text,
      fileName: file.map((value: File) => value.name),
      pageId: pageInfo,
      url: await CreateImgUrl({
        image: previewImg,
        file,
        isEdit: editMode,
      }),
      priority: priorty,
    };
    if (editMode) {
      const obj = { ...(pageData as FirebaseData) };
      const resultObj = Object.assign(content, obj);
      postMutate.mutate({ data: resultObj, pageId: pageInfo });
    } else {
      const addContent = setDataHandler(content);
      postMutate.mutate({ data: addContent, pageId: pageInfo });
    }
  }

  return (
    <div className="upload">
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (title !== "" && text !== "" && user) {
            CreateHandler();
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
        <div className="use__item">
          <input
            type="checkbox"
            className="eachCheckbox"
            id="use__Check"
            onChange={(e) => setPriorty(e.target.checked)}
          />
          <label
            htmlFor="use__check"
            className="check"
            // style={
            //   checkArr.includes(item.id)
            //     ? { border: 0 }
            //     : { border: "1px solid #eee" }
            // }
          >
            <p>노출 우선권 사용하기</p>
            <Image src="/img/checked.svg" alt="체크" width={25} height={25} />
          </label>
        </div>
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
