import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let health: jest.Mocked<HealthCheckService>;
  let http: jest.Mocked<HttpHealthIndicator>;
  let prismaIndicator: jest.Mocked<PrismaHealthIndicator>;
  let memory: jest.Mocked<MemoryHealthIndicator>;
  let disk: jest.Mocked<DiskHealthIndicator>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest
        .fn()
        .mockImplementation((checks) => Promise.all(checks.map((c) => c()))),
    };
    const mockIndicator = {
      pingCheck: jest.fn().mockResolvedValue({ status: 'up' }),
      checkHeap: jest.fn().mockResolvedValue({ status: 'up' }),
      checkStorage: jest.fn().mockResolvedValue({ status: 'up' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockIndicator },
        { provide: PrismaHealthIndicator, useValue: mockIndicator },
        { provide: PrismaService, useValue: {} },
        { provide: MemoryHealthIndicator, useValue: mockIndicator },
        { provide: DiskHealthIndicator, useValue: mockIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    health = module.get(HealthCheckService);
    http = module.get(HttpHealthIndicator);
    prismaIndicator = module.get(PrismaHealthIndicator);
    memory = module.get(MemoryHealthIndicator);
    disk = module.get(DiskHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('checkLiveness', async () => {
    await controller.checkLiveness();
    expect(health.check).toHaveBeenCalled();
    expect(memory.checkHeap).toHaveBeenCalled();
  });

  it('checkReadiness', async () => {
    await controller.checkReadiness();
    expect(health.check).toHaveBeenCalled();
    expect(prismaIndicator.pingCheck).toHaveBeenCalled();
    expect(disk.checkStorage).toHaveBeenCalled();
  });

  it('checkNetwork', async () => {
    await controller.checkNetwork();
    expect(health.check).toHaveBeenCalled();
    expect(http.pingCheck).toHaveBeenCalled();
  });
});
