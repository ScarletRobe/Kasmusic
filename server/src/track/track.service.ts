import { FileService, FileType } from './../file/file.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';
import { UpdateTrackDto } from './dto/update-track.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const pictureInfo = await this.fileService.createFile(FileType.IMAGE, picture);
    const audioInfo = await this.fileService.createFile(FileType.AUDIO, audio);
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioInfo,
      picture: pictureInfo,
    });
    return track;
  }

  async getAll(count = 25, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(offset).limit(count);
    return tracks;
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') },
    });
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments');
    return track;
  }

  async delete(id: ObjectId): Promise<mongoose.Types.ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    const audioRemove = this.fileService.removeFile(FileType.AUDIO, track.audio.name);
    const pictureRemove = this.fileService.removeFile(FileType.IMAGE, track.picture.name);
    await Promise.all([audioRemove, pictureRemove]);
    return track._id;
  }

  async update(id: ObjectId, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.trackModel.findByIdAndUpdate(
      id,
      { ...dto },
      { returnDocument: 'after' },
    );
    return track;
  }

  async addComment(dto: AddCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(trackId: ObjectId) {
    const track = await this.trackModel.findById(trackId);
    track.listens += 1;
    track.save();
  }
}
