/** @jsxImportSource @emotion/react */
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

type Item = {
  id: string;
  text: string;
  important: boolean;
};

type propsType = {
  allcheck?: boolean;
  items: Item[];
  setState: Dispatch<SetStateAction<boolean>>;
};

const Checker = ({ allcheck = true, items, setState }: propsType) => {
  const [checkArr, setCheck] = useState<string[]>([]);

  const allChecker = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "all_check") {
      if (e.target.checked) {
        const checkAll = items.map((item) => item.id);
        setCheck(checkAll);
      } else {
        setCheck([]);
      }
    }
  };

  function checkHanlder(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const copyArr = [...checkArr];
      copyArr.push(e.target.id);
      setCheck(copyArr);
    } else {
      const copyArr = [...checkArr];
      const result = copyArr.filter((item) => item !== e.target.id);
      setCheck(result);
    }
  }

  const importantCheck = useCallback(() => {
    const important1 = checkArr.includes("auth");
    const important2 = checkArr.includes("data");
    if (important1 && important2) {
      setState(false);
    } else {
      setState(true);
    }
  }, [checkArr]);

  useEffect(() => {
    importantCheck();
  }, [checkArr]);

  return (
    <section className="terms">
      {allcheck && (
        <div className="all_check">
          <input
            type="checkbox"
            id="all_check"
            checked={checkArr.length === items.length}
            onChange={(e: ChangeEvent<HTMLInputElement>) => allChecker(e)}
          />
          <label
            htmlFor="all_check"
            className="check"
            style={
              checkArr.length === items.length
                ? { border: 0 }
                : { border: "1px solid #eee" }
            }
          >
            {checkArr.length === items.length && (
              <Image src="/img/checked.svg" alt="체크" width={25} height={25} />
            )}
            전체 약관 동의
          </label>
          <p className="check_text">전체 약관 동의</p>
        </div>
      )}
      <ul className="check_wrap">
        {items.map((item, index) => {
          return (
            <li key={index}>
              <input
                type="checkbox"
                className="eachCheckbox"
                id={item.id}
                name="sub_check"
                checked={checkArr.includes(item.id)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => checkHanlder(e)}
              />
              <label
                htmlFor={item.id}
                className="check"
                style={
                  checkArr.includes(item.id)
                    ? { border: 0 }
                    : { border: "1px solid #eee" }
                }
              >
                {checkArr.includes(item.id) && (
                  <Image
                    src="/img/checked.svg"
                    alt="체크"
                    width={25}
                    height={25}
                  />
                )}
                {item.text}
              </label>
              <p className="check_text">
                <span style={!item.important ? { opacity: 0 } : {}}>
                  *&nbsp;
                </span>
                {item.text}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Checker;
