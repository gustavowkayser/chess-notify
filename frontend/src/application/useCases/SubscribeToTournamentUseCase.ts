import { InvalidTournamentLinkError } from "@/domain/errors/DomainError";
import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";
import { parseTournamentLink } from "@/domain/valueObjects/TournamentLink";

export default class SubscribeToTournamentUseCase {
    constructor(readonly subscriptionRepository: SubscriptionRepository) {}

    async execute(input: string): Promise<string> {
        const link = parseTournamentLink(input);

        if (!link) {
            throw new InvalidTournamentLinkError();
        }

        return this.subscriptionRepository.subscribe(link.href);
    }
}
