import { Test, TestingModule } from '@nestjs/testing';
import { PositionController } from '../position.controller';
import { PositionService } from '../position.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Position } from '../position.entity';

describe('PositionController', () => {
  let controller: PositionController;
  let service: PositionService;

  const mockPosition: Position = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'CEO',
    description: 'Chief Executive Officer',
    parentId: null,
    parent: null as any,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPositionService = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    getChildren: jest.fn(),
    remove: jest.fn(),
    getTree: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionController],
      providers: [
        {
          provide: PositionService,
          useValue: mockPositionService,
        },
      ],
    }).compile();

    controller = module.get<PositionController>(PositionController);
    service = module.get<PositionService>(PositionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new position', async () => {
      const createDto = {
        name: 'CTO',
        description: 'Chief Technology Officer',
        parentId: '123e4567-e89b-12d3-a456-426614174000',
      };
      mockPositionService.create.mockResolvedValue({ ...mockPosition, ...createDto });

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expect.objectContaining(createDto));
    });
  });

  describe('update', () => {
    it('should update an existing position', async () => {
      const updateDto = { name: 'CTO Updated' };
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockPositionService.update.mockResolvedValue({ ...mockPosition, ...updateDto });

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(expect.objectContaining(updateDto));
    });

    it('should throw NotFoundException when position not found', async () => {
      const id = 'non-existent-id';
      mockPositionService.update.mockRejectedValue(
        new NotFoundException(`Position with ID "${id}" not found`),
      );

      await expect(controller.update(id, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single position', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockPositionService.findOne.mockResolvedValue(mockPosition);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockPosition);
    });

    it('should throw NotFoundException when position not found', async () => {
      const id = 'non-existent-id';
      mockPositionService.findOne.mockRejectedValue(
        new NotFoundException(`Position with ID "${id}" not found`),
      );

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all positions', async () => {
      const positions = [mockPosition, { ...mockPosition, id: '2', name: 'CTO' }];
      mockPositionService.findAll.mockResolvedValue(positions);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(positions);
    });
  });

  describe('getTree', () => {
    it('should return organization tree', async () => {
      const tree = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'CEO',
          description: 'Chief Executive Officer',
          parentId: null,
          children: [
            {
              id: '223e4567-e89b-12d3-a456-426614174001',
              name: 'CTO',
              description: 'Chief Technology Officer',
              parentId: '123e4567-e89b-12d3-a456-426614174000',
              children: [],
            },
          ],
        },
      ];
      mockPositionService.getTree.mockResolvedValue(tree);

      const result = await controller.getTree();

      expect(service.getTree).toHaveBeenCalled();
      expect(result).toEqual(tree);
    });
  });

  describe('getChildren', () => {
    it('should return direct children of a position', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const children = [
        { ...mockPosition, id: '2', name: 'CTO', parentId: id },
        { ...mockPosition, id: '3', name: 'CFO', parentId: id },
      ];
      mockPositionService.getChildren.mockResolvedValue(children);

      const result = await controller.getChildren(id);

      expect(service.getChildren).toHaveBeenCalledWith(id);
      expect(result).toEqual(children);
    });

    it('should throw NotFoundException when parent not found', async () => {
      const id = 'non-existent-id';
      mockPositionService.getChildren.mockRejectedValue(
        new NotFoundException(`Position with ID "${id}" not found`),
      );

      await expect(controller.getChildren(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a position', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockPositionService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when position not found', async () => {
      const id = 'non-existent-id';
      mockPositionService.remove.mockRejectedValue(
        new NotFoundException(`Position with ID "${id}" not found`),
      );

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});