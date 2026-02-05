export abstract class DomainEvent {
  readonly occurredOn: Date;
  readonly eventId: string;

  constructor() {
    this.occurredOn = new Date();
    this.eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  abstract getEventName(): string;
}
