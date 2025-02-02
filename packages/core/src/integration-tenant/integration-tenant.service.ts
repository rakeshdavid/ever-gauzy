import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantAwareCrudService } from './../core/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { IntegrationTenant } from './integration-tenant.entity';
import { TenantService } from '../tenant/tenant.service';
import { IntegrationSettingService } from '../integration-setting/integration-setting.service';

@Injectable()
export class IntegrationTenantService extends TenantAwareCrudService<IntegrationTenant> {
	constructor(
		@InjectRepository(IntegrationTenant)
		readonly repository: Repository<IntegrationTenant>,
		private _tenantService: TenantService,
		private _integrationSettingService: IntegrationSettingService
	) {
		super(repository);
	}

	async addIntegration(createIntegrationDto): Promise<IntegrationTenant> {
		const { tenantId, organizationId } = createIntegrationDto;
		const { record: tenant } = await this._tenantService.findOneOrFail(
			tenantId
		);
		const integration = await this.create({
			tenant,
			organizationId,
			name: createIntegrationDto.name,
			entitySettings: createIntegrationDto.entitySettings
		});
		const settingsDto = createIntegrationDto.settings.map((setting) => ({
			...setting,
			integration,
			tenantId
		}));

		await this._integrationSettingService.create(settingsDto);
		return integration;
	}

	async updateIntegration(updateIntegrationDto) {}
}
