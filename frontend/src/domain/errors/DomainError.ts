export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class UnauthorizedError extends DomainError {
    constructor() {
        super("This device is not registered yet.");
    }
}

export class NetworkError extends DomainError {
    constructor() {
        super("Couldn't reach the server. Check your connection.");
    }
}

export class InvalidTournamentLinkError extends DomainError {
    constructor() {
        super("That doesn't look like a tournament link.");
    }
}

export class RequestFailedError extends DomainError {}
