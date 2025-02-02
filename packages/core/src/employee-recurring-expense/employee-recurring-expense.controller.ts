import {
	IStartUpdateTypeInfo,
	PermissionsEnum,
	IRecurringExpenseEditInput
} from '@gauzy/contracts';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination } from '../core';
import { CrudController } from '../core/crud/crud.controller';
import { Permissions } from './../shared/decorators';
import { PermissionGuard, TenantPermissionGuard } from './../shared/guards';
import { ParseJsonPipe, UUIDValidationPipe } from './../shared/pipes';
import {
	EmployeeRecurringExpenseCreateCommand,
	EmployeeRecurringExpenseDeleteCommand,
	EmployeeRecurringExpenseEditCommand
} from './commands';
import { EmployeeRecurringExpense } from './employee-recurring-expense.entity';
import { EmployeeRecurringExpenseService } from './employee-recurring-expense.service';
import {
	EmployeeRecurringExpenseByMonthQuery,
	EmployeeRecurringExpenseStartDateUpdateTypeQuery
} from './queries';

@ApiTags('EmployeeRecurringExpense')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class EmployeeRecurringExpenseController extends CrudController<EmployeeRecurringExpense> {
	constructor(
		private readonly employeeRecurringExpenseService: EmployeeRecurringExpenseService,
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus
	) {
		super(employeeRecurringExpenseService);
	}

	@ApiOperation({ summary: 'Create new expense' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The expense has been successfully created.'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(
		@Body() entity: EmployeeRecurringExpense
	): Promise<EmployeeRecurringExpense> {
		return this.commandBus.execute(
			new EmployeeRecurringExpenseCreateCommand(entity)
		);
	}

	@ApiOperation({ summary: 'Delete record' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The record has been successfully deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_EMPLOYEES_EDIT)
	@Delete(':id')
	async delete(
		@Param('id', UUIDValidationPipe) id: string,
		@Query('data', ParseJsonPipe) data: any
	): Promise<any> {
		const { deleteInput } = data;
		return this.commandBus.execute(
			new EmployeeRecurringExpenseDeleteCommand(id, deleteInput)
		);
	}

	@ApiOperation({ summary: 'Update an existing record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully edited.'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Put(':id')
	async update(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: IRecurringExpenseEditInput
	): Promise<any> {
		return this.commandBus.execute(
			new EmployeeRecurringExpenseEditCommand(id, entity)
		);
	}

	@ApiOperation({ summary: 'Find all employee recurring expense.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee recurring expense',
		type: EmployeeRecurringExpense
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/month')
	async findAllEmployees(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<EmployeeRecurringExpense>> {
		const { findInput, relations } = data;
		return this.queryBus.execute(
			new EmployeeRecurringExpenseByMonthQuery(findInput, relations)
		);
	}

	@ApiOperation({
		summary: 'Find all employee recurring expenses.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee recurring expense',
		type: EmployeeRecurringExpense
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get()
	async findAllRecurringExpenses(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<EmployeeRecurringExpense>> {
		const { findInput, order = {}, relations = [] } = data;
		return this.employeeRecurringExpenseService.findAll({
			where: findInput,
			order: order,
			relations
		});
	}

	@ApiOperation({
		summary: 'Find the start date update type for a recurring expense.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found start date update type'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/date-update-type')
	async findStartDateUpdateType(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IStartUpdateTypeInfo> {
		const { findInput } = data;
		return this.queryBus.execute(
			new EmployeeRecurringExpenseStartDateUpdateTypeQuery(findInput)
		);
	}
}
