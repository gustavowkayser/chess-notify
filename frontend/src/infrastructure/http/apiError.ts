import { isAxiosError } from "axios";
import {
    DomainError,
    NetworkError,
    RequestFailedError,
    UnauthorizedError,
} from "@/domain/errors/DomainError";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface ApiErrorBody {
    success: false;
    message?: string;
    error?: string;
}

export function toDomainError(error: unknown): DomainError {
    if (error instanceof DomainError) {
        return error;
    }

    if (!isAxiosError<ApiErrorBody>(error)) {
        return new RequestFailedError("Something went wrong.");
    }

    if (!error.response) {
        return new NetworkError();
    }

    if (error.response.status === 401) {
        return new UnauthorizedError();
    }

    return new RequestFailedError(
        error.response.data?.message ?? "Something went wrong.",
    );
}
