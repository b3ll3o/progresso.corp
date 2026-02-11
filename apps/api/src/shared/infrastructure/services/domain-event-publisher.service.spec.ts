import { Test, TestingModule } from '@nestjs/testing';
import { DomainEventPublisher } from './domain-event-publisher.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain/events/domain-event.base';

describe('DomainEventPublisher', () => {
  let service: DomainEventPublisher;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainEventPublisher,
        {
          provide: EventEmitter2,
          useValue: {
            emitAsync: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<DomainEventPublisher>(DomainEventPublisher);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish an event', async () => {
    const mockEvent: jest.Mocked<DomainEvent> = {
      getEventName: jest.fn().mockReturnValue('test.event'),
      occurredAt: new Date(),
    } as any;

    await service.publish(mockEvent);

    expect(mockEvent.getEventName).toHaveBeenCalled();
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      'test.event',
      mockEvent,
    );
  });

  it('should publish all events', async () => {
    const mockEvent1: jest.Mocked<DomainEvent> = {
      getEventName: jest.fn().mockReturnValue('event.1'),
      occurredAt: new Date(),
    } as any;
    const mockEvent2: jest.Mocked<DomainEvent> = {
      getEventName: jest.fn().mockReturnValue('event.2'),
      occurredAt: new Date(),
    } as any;

    await service.publishAll([mockEvent1, mockEvent2]);

    expect(eventEmitter.emitAsync).toHaveBeenCalledTimes(2);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith('event.1', mockEvent1);
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith('event.2', mockEvent2);
  });
});
