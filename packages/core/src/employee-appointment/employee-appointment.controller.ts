import { CrudController, IPagination } from '../core';
import { EmployeeAppointment } from './employee-appointment.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
	Controller,
	UseGuards,
	HttpStatus,
	Body,
	Param,
	Get,
	Post,
	Put,
	HttpCode,
	Query
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EmployeeAppointmentService } from './employee-appointment.service';
import { EmployeeAppointmentCreateCommand, EmployeeAppointmentUpdateCommand } from './commands';
import { AuthGuard } from '@nestjs/passport';
import { ParseJsonPipe, UUIDValidationPipe } from './../shared/pipes';
import { I18nLang } from 'nestjs-i18n';
import {
	LanguagesEnum,
	IEmployeeAppointmentCreateInput,
	IEmployeeAppointmentUpdateInput,
	IEmployeeAppointment
} from '@gauzy/contracts';
import { TenantPermissionGuard } from '../shared/guards';

@ApiTags('EmployeeAppointment')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class EmployeeAppointmentController extends CrudController<EmployeeAppointment> {
	constructor(
		private readonly employeeAppointmentService: EmployeeAppointmentService,
		private readonly commandBus: CommandBus
	) {
		super(employeeAppointmentService);
	}

	@ApiOperation({
		summary: 'Find all employee appointments'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee appointments',
		type: EmployeeAppointment
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get()
	async findAll(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<IEmployeeAppointment>> {
		const { relations, findInput } = data;
		return this.employeeAppointmentService.findAll({
			where: findInput,
			relations
		});
	}

	@ApiOperation({ summary: 'Create new record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully created.'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@Post('/create')
	async createEmployeeAppointment(
		@Body() entity: IEmployeeAppointmentCreateInput,
		@I18nLang() languageCode: LanguagesEnum,
		...options: any[]
	) {
		return this.commandBus.execute(
			new EmployeeAppointmentCreateCommand(entity, languageCode)
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
		@Body() entity: IEmployeeAppointmentUpdateInput
	): Promise<any> {
		return this.commandBus.execute(
			new EmployeeAppointmentUpdateCommand(id, entity)
		);
	}

	@ApiOperation({ summary: 'Find Employee appointment by id.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found one record',
		type: EmployeeAppointment
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@UseGuards(AuthGuard('jwt'))
	@Get(':id')
	async findOneById(
		@Param('id', UUIDValidationPipe) id: string
	): Promise<EmployeeAppointment> {
		return this.employeeAppointmentService.findOne(id);
	}

	@ApiOperation({ summary: 'Sign appointment id payload' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Token generated',
		type: String
	})
	@ApiResponse({
		status: HttpStatus.EXPECTATION_FAILED,
		description: 'Token generation failure'
	})
	@UseGuards(AuthGuard('jwt'))
	@Get('/sign/:id')
	async signAppointment(@Param('id', UUIDValidationPipe) id: string): Promise<String> {
		return this.employeeAppointmentService.signAppointmentId(id);
	}

	@ApiOperation({ summary: 'Verify token' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Token verified',
		type: String
	})
	@ApiResponse({
		status: HttpStatus.EXPECTATION_FAILED,
		description: 'Token verification failure'
	})
	@UseGuards(AuthGuard('jwt'))
	@Get('/decode/:token')
	async decodeToken(@Param('token') token: string): Promise<string> {
		const decoded = this.employeeAppointmentService.decode(token);
		return decoded['appointmentId'];
	}
}
