type propsType = {
  nicknameData: string[] | undefined;
  nickname: string;
};

const nicknameHandler = ({ nicknameData, nickname }: propsType) => {
  if (nicknameData) {
    return nicknameData.some((item) => {
      return Object.values(item).includes(nickname);
    });
  } else return false;
};

export default nicknameHandler;
