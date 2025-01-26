async function onFileChange(files: File[]) {
  if (files.length > 0) {
    const result = await Promise.all(
      files.map((item: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          // load
          reader.readAsDataURL(item);
          // create
          reader.onloadend = (e) => {
            // end
            const resultItem = e.target as FileReader;
            if (resultItem) {
              const dataURL = resultItem.result as string;
              resolve(dataURL);
            } else {
              reject(false);
            }
          };
        });
      })
    );
    return { result, files };
  } else {
    throw new Error("유효한 파일이 없습니다.");
  }
}

export default onFileChange;
