import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary : 'Created a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully created'})
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get projects'})
  @ApiResponse({status: 200, description : 'The projects haS been successfully returned'})
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully updated'})
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully deleted '})
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
