import { ObjectId } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
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
  UseInterceptors,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { SortTypes } from 'src/consts';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}
  @Options(':id')
  getOptions() {
    return;
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async create(@Res() res, @Body() dto: CreateTrackDto) {
    const track = await this.trackService.create(dto);
    return res
      .set({
        'access-control-allow-origin': '*',
      })
      .json(track);
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
  search(@Query('query') query: string) {
    return this.trackService.search(query);
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
    console.log(id);
    return this.trackService.listen(id);
  }
}
