import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface DesignRequestSubmission {
    imageURLs: Array<string>;
    furnitureType: string;
    city: string;
    name: string;
    color: string;
    description: string;
    dimensionLength: string;
    dimensionWidth: string;
    phone: string;
    budget: string;
    dimensionHeight: string;
    material: string;
}
export interface DesignRequest {
    status: string;
    imageURLs: Array<string>;
    furnitureType: string;
    city: string;
    name: string;
    color: string;
    description: string;
    dimensionLength: string;
    timestamp: bigint;
    dimensionWidth: string;
    phone: string;
    budget: string;
    dimensionHeight: string;
    material: string;
}
export interface EnquirySubmission {
    service: string;
    city: string;
    name: string;
    message: string;
    phone: string;
}
export interface Enquiry {
    service: string;
    city: string;
    name: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    chatWithAI(userMessage: string): Promise<string>;
    deleteDesignRequest(id: bigint): Promise<void>;
    deleteEnquiry(id: bigint): Promise<void>;
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatbotSystemInfo(): Promise<string>;
    getDesignRequests(): Promise<Array<DesignRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDesignRequest(submission: DesignRequestSubmission): Promise<bigint>;
    submitEnquiry(submission: EnquirySubmission): Promise<bigint>;
    transformChatResponse(input: TransformationInput): Promise<TransformationOutput>;
    updateDesignRequestStatus(id: bigint, status: string): Promise<void>;
}
