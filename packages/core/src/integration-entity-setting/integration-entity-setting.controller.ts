import {
	Controller,
	HttpStatus,
	Get,
	Param,
	Put,
	Body,
	UseGuards
} from '@nestjs/common';
import { CrudController, IPagination } from '../core';
import { IntegrationEntitySetting } from './integration-entity-setting.entity';
import { IntegrationEntitySettingService } from './integration-entity-setting.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TenantPermissionGuard } from './../shared/guards';
import { UUIDValidationPipe } from './../shared/pipes';


@ApiTags('IntegrationsEntitySetting')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class IntegrationEntitySettingController extends CrudController<IntegrationEntitySetting> {
	constructor(
		private integrationEntitySettingService: IntegrationEntitySettingService
	) {
		super(integrationEntitySettingService);
	}

	@ApiOperation({ summary: 'Get settings.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found settings',
		type: IntegrationEntitySetting
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get(':integrationId')
	async getSettingsForIntegration(
		@Param('integrationId', UUIDValidationPipe) integrationId
	): Promise<IPagination<IntegrationEntitySetting>> {
		return await this.integrationEntitySettingService.findAll({
			relations: ['integration', 'tiedEntities'],
			where: {
				integration: { id: integrationId }
			}
		});
	}

	@ApiOperation({ summary: 'Update settings.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Update settings',
		type: IntegrationEntitySetting
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Put(':integrationId')
	async editSettings(
		@Param('integrationId', UUIDValidationPipe) integrationId,
		@Body() editSettingsDto
	): Promise<IntegrationEntitySetting> {
		return await this.integrationEntitySettingService.create(
			editSettingsDto
		);
	}
}
