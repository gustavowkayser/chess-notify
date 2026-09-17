import ListSubscriptionsUseCase from "@/application/useCases/ListSubscriptionsUseCase";
import SearchTournamentsUseCase from "@/application/useCases/SearchTournamentsUseCase";
import SubscribeToTournamentUseCase from "@/application/useCases/SubscribeToTournamentUseCase";
import UnsubscribeUseCase from "@/application/useCases/UnsubscribeUseCase";
import HttpSubscriptionRepository from "@/infrastructure/repositories/HttpSubscriptionRepository";
import { api } from "@/infrastructure/services/api";

/** Composition root: the only place wiring infrastructure into use cases. */
const subscriptionRepository = new HttpSubscriptionRepository(api);

export const container = {
    listSubscriptions: new ListSubscriptionsUseCase(subscriptionRepository),
    subscribeToTournament: new SubscribeToTournamentUseCase(
        subscriptionRepository,
    ),
    unsubscribe: new UnsubscribeUseCase(subscriptionRepository),
    searchTournaments: new SearchTournamentsUseCase(subscriptionRepository),
};
