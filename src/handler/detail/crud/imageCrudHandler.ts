import { ChangeEvent } from "react";
import onFileChange from "../../file/onFileChangeHandler";
import storageUpload from "../../file/storageUploadHandler";

// input file에서 선택한 이미지를 불러오는 로직
export const LoadImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {
  const initialArray = { result: [], files: [] };
  const files = e.target.files || [];
  if (files.length > 0) {
    const files = Array.from(e.target.files as FileList);
    const result = await onFileChange(files);
    return result;
  } else {
    return initialArray;
  }
};

type urlProps = {
  image: string[];
  file: File[];
  isEdit?: boolean;
};

export async function CreateImgUrl({ image, file, isEdit }: urlProps) {
  if (isEdit) {
    return await storageUpload(image, file);
  } else {
    const isMatch = image.filter((item) => {
      return item.match(/data:image\/(png|jpg|jpeg|gif|bmp);base64/);
    });
    if (isMatch.length > 0) {
      const imageResult = await storageUpload(isMatch, file);
      const newUrl = imageResult.filter((item) => item !== undefined);
      const oldUrl = image.filter((item) => item.includes("firebase"));
      const result = [...oldUrl, ...newUrl];
      return result;
    } else {
      return image;
    }
  }
}

type deleteProps = {
  array: { image: string[]; file: string[] };
  fileIndex: number;
};

// 이미 업로드 된 이미지를 삭제하는 로직
export function ImageDeleteHandler({ array, fileIndex }: deleteProps) {
  const filter1 = array.image.filter((item, index) => index !== fileIndex);
  const filter2 = array.file.filter((item, index) => index !== fileIndex);
  return { image: filter1, files: filter2 };
}
