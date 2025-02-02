import { Controller, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployeeSettingService } from './employee-setting.service';
import { EmployeeSetting } from './employee-setting.entity';
import { CrudController } from '../core/crud/crud.controller';
import { IPagination } from '../core';
import { AuthGuard } from '@nestjs/passport';
import { TenantPermissionGuard } from './../shared/guards';
import { ParseJsonPipe } from './../shared/pipes';

@ApiTags('EmployeeSetting')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class EmployeeSettingController extends CrudController<EmployeeSetting> {
	constructor(
		private readonly employeeSettingService: EmployeeSettingService
	) {
		super(employeeSettingService);
	}

	@ApiOperation({ summary: 'Find all employee settings.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee settings',
		type: EmployeeSetting
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get()
	async findAllEmployees(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<EmployeeSetting>> {
		const { relations, findInput } = data;
		return this.employeeSettingService.findAll({
			where: findInput,
			relations
		});
	}
}
