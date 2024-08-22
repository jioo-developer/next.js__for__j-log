type propsType = {
  nicknameData: string[];
  nickname: string;
};

const nicknameHandler = ({ nicknameData, nickname }: propsType) => {
  return nicknameData.some((item) => {
    return Object.values(item).includes(nickname);
  });
};

export default nicknameHandler;
