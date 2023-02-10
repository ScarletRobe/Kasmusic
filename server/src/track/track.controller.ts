import { ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Post()
  create(@Body() dto: CreateTrackDto) {
    return this.trackService.create(dto);
  }

  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @Post(':id')
  update(@Param('id') id: ObjectId, @Body() dto: UpdateTrackDto) {
    return this.trackService.update(id, dto);
  }
}
