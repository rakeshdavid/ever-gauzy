import {
	Controller,
	UseGuards,
	Get,
	Query,
	Put,
	Param,
	Body
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController, IPagination } from '../core';
import { ExpenseCategoriesService } from './expense-categories.service';
import { ExpenseCategory } from './expense-category.entity';
import { AuthGuard } from '@nestjs/passport';
import { TenantPermissionGuard } from './../shared/guards';
import { ParseJsonPipe, UUIDValidationPipe } from './../shared/pipes';

@ApiTags('ExpenseCategories')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class ExpenseCategoriesController extends CrudController<ExpenseCategory> {
	constructor(
		private readonly expenseCategoriesService: ExpenseCategoriesService
	) {
		super(expenseCategoriesService);
	}

	@Get()
	async findAllOrganizationExpenseCategories(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<ExpenseCategory>> {
		const { relations, findInput } = data;
		return this.expenseCategoriesService.findAll({
			where: findInput,
			relations
		});
	}
	@Put(':id')
	async updateOrganizationExpenseCategories(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: ExpenseCategory,
		...options: any[]
	): Promise<ExpenseCategory> {
		return this.expenseCategoriesService.create({
			id,
			...entity
		});
	}
}
