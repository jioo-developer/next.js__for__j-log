import { storageService } from "@/app/Firebase";
import { deleteObject, ref } from "firebase/storage";
import { FirebaseData } from "@/app/api_hooks/detail/getDetailHooks";

export default async function DeleteHandler(pageData: FirebaseData) {
  await Promise.all(
    pageData.fileName.map(async (item: string) => {
      const imageRef = ref(storageService, `${pageData.writer}/${item}`);
      await deleteObject(imageRef);
    })
  );
}
