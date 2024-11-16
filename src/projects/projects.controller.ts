import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShareProjectDto } from './dto/share-project.dto';
import { ExitProjectDto } from './dto/exit-project.dto';

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

  @Post("/shareProject")
  @ApiOperation({ summary : 'Shared a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully shared'})
  shareProject(@Body() shareProjectDto: ShareProjectDto ) {
    return this.projectsService.shareProject(shareProjectDto);
  }

  @Post("/exitProject")
  @ApiOperation({ summary : 'Shared a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully exit'})
  exitProject(@Body() exitProjectDto: ExitProjectDto ) {
    return this.projectsService.exitProject(exitProjectDto);
  }

  @Get(':userId')
  @ApiOperation({ summary : 'Get projects'})
  @ApiResponse({status: 200, description : 'The projects haS been successfully returned'})
  findAll(@Param('userId') userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Get('/project/:id')
  @ApiOperation({ summary : 'Get a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully updated'})
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a project'})
  @ApiResponse({status: 200, description : 'A project has been successfully deleted '})
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
