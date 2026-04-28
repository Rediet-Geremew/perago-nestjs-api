import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './position.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  /**
   * POST /positions - Create a new position/role
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new position/role' })
  @ApiResponse({ status: 201, description: 'Position created successfully', type: Position })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Parent position not found' })
  @ApiBody({ type: CreatePositionDto })
  async create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.create(createPositionDto);
  }

  /**
   * GET /positions - Get all positions (flat list)
   */
  @Get()
  @ApiOperation({ summary: 'Get all positions', description: 'Retrieves all positions as a flat list.' })
  @ApiResponse({ status: 200, description: 'Positions retrieved successfully', type: [Position] })
  async findAll(): Promise<Position[]> {
    return this.positionService.findAll();
  }

  /**
   * GET /positions/tree - Get complete organization hierarchy as nested tree
   * IMPORTANT: This MUST come BEFORE @Get(':id') to prevent "tree" being interpreted as an ID
   */
  @Get('tree')
  @ApiOperation({ summary: 'Get organization hierarchy tree', description: 'Returns the complete organization hierarchy as a nested tree structure with unlimited depth.' })
  @ApiResponse({ status: 200, description: 'Organization tree retrieved successfully' })
  async getTree() {
    return this.positionService.getTree();
  }

  /**
   * GET /positions/:id - Get single position details
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get single position details', description: 'Retrieves details of a specific position by ID.' })
  @ApiResponse({ status: 200, description: 'Position found', type: Position })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @ApiParam({ name: 'id', description: 'UUID of the position', type: String })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Position> {
    return this.positionService.findOne(id);
  }

  /**
   * GET /positions/:id/children - Get all direct children of a position
   */
  @Get(':id/children')
  @ApiOperation({ summary: 'Get direct children of a position', description: 'Retrieves all direct child positions of a specific position.' })
  @ApiResponse({ status: 200, description: 'Children retrieved successfully', type: [Position] })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @ApiParam({ name: 'id', description: 'UUID of the parent position', type: String })
  async getChildren(@Param('id', ParseUUIDPipe) id: string): Promise<Position[]> {
    return this.positionService.getChildren(id);
  }

  /**
   * PUT /positions/:id - Update an existing position
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing position', description: 'Updates an existing position. Can change name, description, or parent.' })
  @ApiResponse({ status: 200, description: 'Position updated successfully', type: Position })
  @ApiResponse({ status: 400, description: 'Invalid input data or circular reference' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @ApiParam({ name: 'id', description: 'UUID of the position to update', type: String })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<Position> {
    return this.positionService.update(id, updatePositionDto);
  }

  /**
   * DELETE /positions/:id - Remove a position
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a position', description: 'Removes a position. Children are re-parented to the deleted position\'s parent.' })
  @ApiResponse({ status: 204, description: 'Position deleted successfully' })
  @ApiResponse({ status: 404, description: 'Position not found' })
  @ApiParam({ name: 'id', description: 'UUID of the position to delete', type: String })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.positionService.remove(id);
  }
}