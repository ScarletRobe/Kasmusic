import { Req } from '@nestjs/common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Options,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { Response } from 'express';
import { ObjectId } from 'mongoose';

import { RequiredRoles } from '../common/decorators/requiredRoles.decorator';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { TrackService } from './track.service';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Roles } from '../user/enums';
import { SortTypes } from '../consts';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Options(':id')
  getOptions() {
    return;
  }

  @Post()
  @RequiredRoles(Roles.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async create(@Req() req, @Res() res, @Body() dto: CreateTrackDto) {
    try {
      const track = await this.trackService.create(dto, req.user['sub']);
      res
      .set({
        'access-control-allow-origin': '*',
      })
        .status(201)
      .json(track);
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  }

  @Get()
  getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('sort') sort: SortTypes,
  ) {
    return this.trackService.getAll(count, offset, sort);
  }

  @Get('/search')
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('query') query: string,
    @Query('sort') sort: SortTypes,
  ) {
    return this.trackService.search(count, offset, query, sort);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() dto: UpdateTrackDto) {
    return this.trackService.update(id, dto);
  }

  @Post('/comment')
  addComment(@Body() dto: AddCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }
}
