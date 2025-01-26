import { authService, storageService } from "../../../Firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { userData } from "@/type/commonType";

async function storageUpload(imageurl: string | string[], fileData: File[]) {
  const user = authService.currentUser as userData;
  if (fileData.length > 0) {
    return await Promise.all(
      fileData.map(async (item, index) => {
        const fileRef = ref(storageService, `${user.uid}/${item.name}`);
        const response = await uploadString(
          fileRef,
          imageurl[index],
          "data_url"
        );
        return await getDownloadURL(response.ref);
      })
    );
  } else return [];
}

export default storageUpload;
