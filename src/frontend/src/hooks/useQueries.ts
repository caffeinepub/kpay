import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateTransferRequest,
  type PaystackTransferRequest,
  TransactionStatus,
  type UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTransactionHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      accountNumber: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createUserProfile(data.name, data.phone, data.accountNumber);
      const profile: UserProfile = {
        balance: BigInt(5000000),
        name: data.name,
        accountNumber: data.accountNumber,
        phone: data.phone,
      };
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useCreateTransfer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateTransferRequest) => {
      if (!actor) throw new Error("Not connected");
      const txId = await actor.createTransfer(request);
      await new Promise((r) => setTimeout(r, 2000));
      await actor.confirmTransfer({
        status: TransactionStatus.completed,
        transactionId: txId,
      });
      return txId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useIsPaystackConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["paystackConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as any).isPaystackConfigured() as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useResolvePaystackAccount(
  accountNumber: string,
  bankCode: string,
) {
  const { actor, isFetching } = useActor();
  const enabled =
    !!actor &&
    !isFetching &&
    accountNumber.length >= 10 &&
    bankCode.length >= 2;
  return useQuery({
    queryKey: ["resolveAccount", accountNumber, bankCode],
    queryFn: async () => {
      if (!actor) return null;
      const raw: string = await (actor as any).resolvePaystackAccount(
        accountNumber,
        bankCode,
      );
      const parsed = JSON.parse(raw);
      if (parsed?.status && parsed?.data?.account_name) {
        return { accountName: parsed.data.account_name as string };
      }
      return null;
    },
    enabled,
    retry: false,
  });
}

export function useInitiatePaystackTransfer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: PaystackTransferRequest) => {
      if (!actor) throw new Error("Not connected");
      const raw: string = await (actor as any).initiatePaystackTransfer(
        request,
      );
      return JSON.parse(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useSetPaystackKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).setPaystackKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paystackConfigured"] });
    },
  });
}
