import { CandidateSource } from './candidate-source.entity';
import {
	Post,
	UseGuards,
	HttpStatus,
	Get,
	Query,
	Body,
	Controller,
	Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrudController } from '../core/crud/crud.controller';
import { CandidateSourceService } from './candidate-source.service';
import { AuthGuard } from '@nestjs/passport';
import { IPagination } from '../core';
import { ICandidateSource } from '@gauzy/contracts';
import { TenantPermissionGuard } from './../shared/guards';
import { ParseJsonPipe } from './../shared/pipes';

@ApiTags('CandidateSource')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class CandidateSourceController extends CrudController<CandidateSource> {
	constructor(
		private readonly candidateSourceService: CandidateSourceService
	) {
		super(candidateSourceService);
	}
	@ApiOperation({
		summary: 'Find all candidate source.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found candidate source',
		type: CandidateSource
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get()
	async findSource(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<ICandidateSource>> {
		const { findInput } = data;
		return this.candidateSourceService.findAll({ where: findInput });
	}

	@ApiOperation({
		summary: 'Create candidate source.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Created candidate source',
		type: CandidateSource
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Post()
	async create(@Body() entity: ICandidateSource): Promise<any> {
		return this.candidateSourceService.create(entity);
	}

	@ApiOperation({
		summary: 'Update candidate source.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Updated candidate source',
		type: CandidateSource
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Put('updateBulk')
	async updateBulk(@Body() entity: ICandidateSource[]): Promise<any> {
		return this.candidateSourceService.updateBulk(entity);
	}
}
