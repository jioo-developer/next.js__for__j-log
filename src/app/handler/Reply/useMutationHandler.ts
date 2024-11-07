import { useMutation, useQueryClient } from "@tanstack/react-query";
import replyUpdateHandler from "@/app/handler/Reply/replyUpdateHandler";
import createReplyHandler from "@/app/handler/Reply/createReplyHandler";
import replyDeleteHandler from "@/app/handler/Reply/replyDeleteHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { replyType } from "@/app/api_hooks/Reply/getReplyHook";

export interface useReplyProps {
  id: string;
  replyId?: string;
  comment: string;
}

export const useCreateHandler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReplyHandler,
    onSuccess: async (result) => {
      await queryClient.refetchQueries({
        queryKey: ["getReply"],
      });
      queryClient.setQueryData<replyType[]>(
        ["getReply"],
        (oldData: replyType[] | any) => {
          if (oldData) {
            // 이전 데이터가 있는 경우, 새로운 데이터를 추가
            return [...oldData, result];
          } else {
            // 이전 데이터가 없는 경우, 새로운 데이터로 초기화
            return [result];
          }
        }
      );
    },
    onError: () => {
      popuprHandler({ message: "에러가 발생하여 댓글이 작성되지 않았습니다" });
    },
  });
};

export const useUpdateHandler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replyUpdateHandler,
    onSuccess: async (result) => {
      await queryClient.refetchQueries({
        queryKey: ["getReply"],
      });
      queryClient.setQueryData<replyType[]>(
        ["getReply"],
        (oldData: replyType | any) => {
          if (oldData) {
            // 이전 데이터가 있는 경우, 새로운 데이터를 추가
            return [...oldData, result];
          } else {
            // 이전 데이터가 없는 경우, 새로운 데이터로 초기화
            return [result];
          }
        }
      );
    },

    onError: () => {
      popuprHandler({ message: "댓글 수정 중 문제가 생겼습니다" });
    },
  });
};

export const useDeleteHandler = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replyDeleteHandler,
    onSuccess: async (result) => {
      await queryClient.refetchQueries({
        queryKey: ["getReply"],
      });
      queryClient.setQueryData(["getReply"], () => {
        return result;
      });
    },
    onError: () => {
      popuprHandler({ message: "댓글 삭제 중 문제가 생겼습니다" });
    },
  });
};
