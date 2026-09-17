import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";

export default class UnsubscribeUseCase {
    constructor(readonly subscriptionRepository: SubscriptionRepository) {}

    async execute(subscriptionId: string): Promise<void> {
        await this.subscriptionRepository.unsubscribe(subscriptionId);
    }
}
