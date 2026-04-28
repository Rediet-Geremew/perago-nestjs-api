import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

export interface PositionTreeNode {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  children: PositionTreeNode[];
}

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    if (createPositionDto.parentId) {
      const parent = await this.positionRepository.findOne({
        where: { id: createPositionDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent position with ID "${createPositionDto.parentId}" not found`);
      }
    }
    const position = this.positionRepository.create(createPositionDto);
    return this.positionRepository.save(position);
  }

  async update(id: string, updatePositionDto: UpdatePositionDto): Promise<Position> {
    const position = await this.findOne(id);
    if (updatePositionDto.parentId) {
      if (updatePositionDto.parentId === id) {
        throw new BadRequestException('A position cannot be its own parent');
      }
      const parent = await this.positionRepository.findOne({
        where: { id: updatePositionDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent position with ID "${updatePositionDto.parentId}" not found`);
      }
      const isDescendant = await this.isDescendant(id, updatePositionDto.parentId);
      if (isDescendant) {
        throw new BadRequestException('Cannot set a descendant position as parent');
      }
    }
    Object.assign(position, updatePositionDto);
    return this.positionRepository.save(position);
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!position) {
      throw new NotFoundException(`Position with ID "${id}" not found`);
    }
    return position;
  }

  async findAll(): Promise<Position[]> {
    return this.positionRepository.find({
      relations: ['parent'],
      order: { createdAt: 'ASC' },
    });
  }

  async getChildren(id: string): Promise<Position[]> {
    await this.findOne(id);
    return this.positionRepository.find({
      where: { parentId: id },
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  async remove(id: string): Promise<void> {
    const position = await this.findOne(id);
    const children = await this.positionRepository.find({
      where: { parentId: id },
    });
    if (children.length > 0) {
      await this.positionRepository.update(
        { parentId: id },
        { parentId: position.parentId },
      );
    }
    await this.positionRepository.remove(position);
  }

  /**
   * Get complete organization hierarchy - FIXED VERSION
   */
  async getTree(): Promise<PositionTreeNode[]> {
    // Get all positions
    const allPositions = await this.positionRepository.find();
    
    // Create a map for quick lookups
    const positionMap = new Map<string, PositionTreeNode>();
    
    // Initialize all positions in the map
    allPositions.forEach(pos => {
      positionMap.set(pos.id, {
        id: pos.id,
        name: pos.name,
        description: pos.description,
        parentId: pos.parentId,
        children: [],
      });
    });
    
    // Build the tree - ONLY include root positions
    const tree: PositionTreeNode[] = [];
    
    allPositions.forEach(pos => {
      const node = positionMap.get(pos.id);
      if (!node) return;
      
      if (pos.parentId === null) {
        // Root position - add to tree
        tree.push(node);
      } else {
        // Child position - add to parent's children
        const parent = positionMap.get(pos.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Parent not found - treat as root (fallback)
          tree.push(node);
        }
      }
    });
    
    return tree;
  }

  private async isDescendant(positionId: string, potentialAncestorId: string): Promise<boolean> {
    const position = await this.positionRepository.findOne({
      where: { id: positionId },
      relations: ['parent'],
    });
    if (!position || !position.parentId) return false;
    if (position.parentId === potentialAncestorId) return true;
    return this.isDescendant(position.parentId, potentialAncestorId);
  }
}