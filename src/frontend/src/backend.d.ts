import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface DesignRequestSubmission {
    name: string;
    phone: string;
    city: string;
    furnitureType: string;
    dimensionLength: string;
    dimensionWidth: string;
    dimensionHeight: string;
    material: string;
    color: string;
    budget: string;
    description: string;
    imageURLs: string[];
}
export interface DesignRequest {
    name: string;
    phone: string;
    city: string;
    furnitureType: string;
    dimensionLength: string;
    dimensionWidth: string;
    dimensionHeight: string;
    material: string;
    color: string;
    budget: string;
    description: string;
    imageURLs: string[];
    timestamp: bigint;
    status: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEnquiry(id: bigint): Promise<void>;
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEnquiry(submission: EnquirySubmission): Promise<bigint>;
    submitDesignRequest(submission: DesignRequestSubmission): Promise<bigint>;
    getDesignRequests(): Promise<Array<DesignRequest>>;
    updateDesignRequestStatus(id: bigint, status: string): Promise<void>;
    deleteDesignRequest(id: bigint): Promise<void>;
}
