import type { Subscription } from "@/domain/entities/Subscription";
import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";

export default class ListSubscriptionsUseCase {
    constructor(readonly subscriptionRepository: SubscriptionRepository) {}

    async execute(): Promise<Subscription[]> {
        const subscriptions = await this.subscriptionRepository.list();

        return subscriptions.sort((a, b) =>
            a.tournament.name.localeCompare(b.tournament.name),
        );
    }
}
