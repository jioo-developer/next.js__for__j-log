import { db, storageService } from "../../../Firebase";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { FirebaseData } from "@/app/api_hooks/detail/getDetailHook";

async function pageDelete(data: FirebaseData) {
  const files = data.fileName;
  const writer = data.writer;
  const id = data.pageId;

  if (files.length > 0) {
    await DeleteHandler(files, writer);
  }

  const ref = doc(db, "post", id);
  await deleteDoc(ref);
}

async function DeleteHandler(files: string[], writer: string) {
  await Promise.all(
    files.map(async (item: string) => {
      const imageRef = ref(storageService, `${writer}/${item}`);
      await deleteObject(imageRef);
    })
  );
}

export default pageDelete;
