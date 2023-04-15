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
import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';

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
  @Post('/delcom')
  delcom(@Body() body) {
    this.trackService.delcom(body);
  }

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
      res.status(201).json(track);
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
  @RequiredRoles(Roles.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async delete(@Param('id') id: ObjectId, @Req() req, @Res() res: Response) {
    try {
      const isAdmin = req.user.roles.includes(Roles.ADMIN);
      if (!isAdmin) {
        await this.trackService.checkIsTrackAuthor(req.user.sub, id);
      }
      res.status(200).json(await this.trackService.delete(id));
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @Patch(':id')
  @RequiredRoles(Roles.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async update(
    @Param('id') id: ObjectId,
    @Body() dto: UpdateTrackDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const isAdmin = req.user.roles.includes(Roles.ADMIN);
      if (!isAdmin) {
        await this.trackService.checkIsTrackAuthor(req.user.sub, id);
      }
      res.status(200).json(await this.trackService.update(String(id), dto));
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  }

  @Post('/comment')
  @RequiredRoles(Roles.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  addComment(@Body() dto: AddCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }

  @Post('/like/:id')
  @RequiredRoles(Roles.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async like(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: mongoose.Types.ObjectId,
  ) {
    try {
      await this.trackService.like(id, req.user['sub']);
      res.status(200).json();
    } catch (error) {
      res.status(400).json(error.message);
    }
  }

  @Post('/unlike/:id')
  @RequiredRoles(Roles.USER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  async unlike(
    @Req() req,
    @Res() res: Response,
    @Param('id') id: mongoose.Types.ObjectId,
  ) {
    try {
      await this.trackService.unlike(id, req.user['sub']);
      res.status(200).json();
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
}
