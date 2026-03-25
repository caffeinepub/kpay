import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    balance: bigint;
    name: string;
    accountNumber: string;
    phone: string;
}
export interface ConfirmTransferRequest {
    status: TransactionStatus;
    transactionId: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface Transaction {
    id: string;
    status: TransactionStatus;
    transactionType: TransactionType;
    createdAt: Time;
    user: Principal;
    reference: string;
    amount: bigint;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface CreateTransferRequest {
    bank: string;
    reference: string;
    description: string;
    accountNumber: string;
    amount: bigint;
}
export interface PaystackTransferRequest {
    bankCode: string;
    accountNumber: string;
    amount: bigint;
    narration: string;
    reference: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface TransactionFilter {
    userFilter?: Principal;
    transactionTypeFilter?: TransactionType;
    statusFilter?: TransactionStatus;
}
export enum TransactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum TransactionType {
    bill = "bill",
    airtime = "airtime",
    transfer = "transfer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmTransfer(request: ConfirmTransferRequest): Promise<void>;
    createAdminProfile(name: string, phone: string, accountNumber: string, principal: Principal): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createTransfer(request: CreateTransferRequest): Promise<string>;
    createUserProfile(name: string, phone: string, accountNumber: string): Promise<void>;
    filterTransactions(filter: TransactionFilter): Promise<Array<Transaction>>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTransactionHistory(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    isPaystackConfigured(): Promise<boolean>;
    resolvePaystackAccount(accountNumber: string, bankCode: string): Promise<string>;
    initiatePaystackTransfer(request: PaystackTransferRequest): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendNotification(title: string, message: string, user: Principal | null): Promise<string>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setPaystackKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
