import {
	Controller,
	Get,
	Post,
	UsePipes,
	ValidationPipe,
	Body,
	Param,
	Patch,
	Delete,
	UseGuards,
	Query
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './category.dto';
import { TokenGuard } from '../auth/token.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
	ApiCreatedResponse,
	ApiTags,
	ApiOkResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
	ApiBody,
	ApiQuery
} from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get()
	// @UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Category')
	@ApiOkResponse({ description: 'Success' })
	// @ApiBearerAuth('Authorization')
	// @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number
	})
	@ApiQuery({
		name: "search",
		required: false,
		type: Number
	  })
      getAllCategory(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
		return this.categoryService.getAllCategory(page, limit, search);
	}

	@Get('/dashboard')
    @UseGuards(TokenGuard, JwtAuthGuard)
    @ApiTags('Category')
    @ApiOkResponse({ description: 'Success' })
    @ApiBearerAuth('Authorization')
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    getCategoryDashboard(){
        return this.categoryService.getCategoryDashboard();
    }

	@Post()
	@UseGuards(TokenGuard, JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@ApiTags('Category')
	@ApiCreatedResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiBody({ type: CategoryDTO })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	saveCategory(@Body() data: CategoryDTO) {
		return this.categoryService.saveCategory(data);
	}

	@Get(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Category')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	getCategory(@Param('id') id: string) {
		return this.categoryService.getCategory(id);
	}

	@Patch(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Category')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	@ApiBody({ type: CategoryDTO })
	updateCategory(@Param('id') id: string, @Body() data: Partial<CategoryDTO>) {
		return this.categoryService.updateCategory(id, data);
	}

	@Delete(':id')
	@UseGuards(TokenGuard, JwtAuthGuard)
	@ApiTags('Category')
	@ApiOkResponse({ description: 'Success' })
	@ApiBearerAuth('Authorization')
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	deleteCategory(@Param('id') id: string) {
		return this.categoryService.deleteCategory(id);
	}
}
