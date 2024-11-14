import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ItemStore from "@/stories/modules/ItemStore/ItemStore";
import useCashMutation from "@/app/api_hooks/common/setCashMutation";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: { uid: "123" }, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/common/getCashHook", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    CashData: [
      {
        cash: 10000,
        item: 5,
      },
    ],
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/common/getCashHook");
jest.mock("@/app/api_hooks/common/setCashMutation");

(useCashMutation as jest.Mock).mockReturnValue({
  mutateAsync: jest.fn(),
});

const mockSetState = jest.fn();

describe("ItemStore 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("아이템 선택 시 value 변경", () => {
    render(<ItemStore setState={mockSetState} />);

    // '우선권 1회권' 선택
    const itemButton = screen.getByText("우선권 1회권");
    fireEvent.click(itemButton);

    // 구매 버튼 클릭
    const confirmButton = screen.getByText("확인");
    fireEvent.click(confirmButton);

    const mutation = useCashMutation();

    expect(mutation.mutateAsync).toHaveBeenCalledWith({
      cash: 7500,
      item: 6,
    });
  });

  test("구매 버튼 클릭 시 포인트 차감 및 아이템 증가", async () => {
    render(<ItemStore setState={mockSetState} />);

    // '우선권 1회권' 선택
    const itemButton = screen.getByText("우선권 1회권");
    fireEvent.click(itemButton);

    const confirmButton = screen.getByText("확인");
    fireEvent.click(confirmButton);

    const mutation = useCashMutation();

    expect(mutation.mutateAsync).toHaveBeenCalledWith({
      cash: 7500, // 10000 - 2500
      item: 6, // 기존 2 + 1
    });
  });
});
