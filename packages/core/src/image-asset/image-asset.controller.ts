import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	UseGuards,
	Query,
	HttpCode,
	HttpStatus,
	Delete
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CrudController, IPagination } from '../core';
import { PermissionGuard, TenantPermissionGuard } from './../shared/guards';
import { PermissionsEnum } from '@gauzy/contracts';
import { Permissions } from './../shared/decorators';
import { ParseJsonPipe } from '../shared/pipes/parse-json.pipe';
import { ImageAsset } from './image-asset.entity';
import { ImageAssetService } from './image-asset.service';
import { UUIDValidationPipe } from './../shared/pipes';

@ApiTags('ImageAsset')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class ImageAssetController extends CrudController<ImageAsset> {
	constructor(private readonly imageAssetService: ImageAssetService) {
		super(imageAssetService);
	}

	@Get('/:id')
	async findById(@Param('id', UUIDValidationPipe) id: string): Promise<ImageAsset> {
		return this.imageAssetService.findOne(id);
	}

	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.INVENTORY_GALLERY_EDIT)
	@Post()
	async createRecord(@Body() entity: ImageAsset): Promise<ImageAsset> {
		return this.imageAssetService.create(entity);
	}

	@Get()
	async getAllAssets(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<ImageAsset>> {
		const { relations, findInput } = data;
		return this.imageAssetService.findAll({
			where: findInput,
			relations
		});
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@Delete(':id')
	async delete(@Param('id', UUIDValidationPipe) id: string): Promise<any> {
		return this.imageAssetService.deleteAsset(id);
	}
}
