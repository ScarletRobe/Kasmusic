import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';

import { UserService } from '../user/user.service';
import { FileService, FileType } from './../file/file.service';

import { Comment, CommentDocument } from './schemas/comment.schema';
import { Track, TrackDocument } from './schemas/track.schema';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { SortTypes } from '../consts';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
    private userService: UserService,
  ) {}

  async create(
    dto: CreateTrackDto,
    authorId: mongoose.Types.ObjectId,
  ): Promise<Track> {
    const track = await this.trackModel.create({
      ...dto,
      picture: JSON.parse(dto.picture),
      audio: JSON.parse(dto.audio),
      listens: 0,
      author: authorId,
    });
    this.userService.addUploadedTrack(authorId, track._id);
    return track;
  }

  async getAll(
    count = 25,
    offset = 0,
    sort: SortTypes = SortTypes.NEWEST,
  ): Promise<{ totalPages: number; data: Track[] }> {
    let tracks;
    const documentsAmount = await this.trackModel.countDocuments();
    const totalPages = Math.ceil(documentsAmount / count);
    switch (sort) {
      case SortTypes.NEWEST:
        tracks = await this.trackModel
          .find()
          .sort({ _id: -1 })
          .skip(offset)
          .limit(count);
        break;
      case SortTypes.LATEST:
        tracks = await this.trackModel.find().skip(offset).limit(count);
        break;
      case SortTypes.MOST_LISTENED:
        tracks = await this.trackModel
          .find()
          .sort({ listens: -1 })
          .skip(offset)
          .limit(count);
        break;
      case SortTypes.LEAST_LISTENED:
        tracks = await this.trackModel
          .find()
          .sort({ listens: 1 })
          .skip(offset)
          .limit(count);
        break;
    }

    return { totalPages, data: tracks };
  }

  async search(
    count = 25,
    offset = 0,
    query: string,
    sort: SortTypes = SortTypes.NEWEST,
  ): Promise<{ totalPages: number; data: Track[]; amount: number }> {
    let tracks;
    const queryRE = new RegExp(query, 'i');
    const documentsAmount = await this.trackModel.countDocuments({
      name: { $regex: queryRE },
    });
    const totalPages = Math.ceil(documentsAmount / count);

    switch (sort) {
      case SortTypes.NEWEST:
        tracks = await this.trackModel
          .find({
            name: { $regex: queryRE },
          })
          .sort({ _id: -1 })
          .skip(offset)
          .limit(count);
        break;
      case SortTypes.LATEST:
        tracks = await this.trackModel
          .find({
            name: { $regex: queryRE },
          })
          .skip(offset)
          .limit(count);
        break;
      case SortTypes.MOST_LISTENED:
        tracks = await this.trackModel
          .find({
            name: { $regex: queryRE },
          })
          .sort({ listens: -1 })
          .skip(offset)
          .limit(count);
        break;
      case SortTypes.LEAST_LISTENED:
        tracks = await this.trackModel
          .find({
            name: { $regex: queryRE },
          })
          .sort({ listens: 1 })
          .skip(offset)
          .limit(count);
        break;
    }
    return { totalPages, amount: documentsAmount, data: tracks };
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel
      .findById(id)
      .populate({
        path: 'comments',
        populate: { path: 'user', select: { username: 1, avatarLink: 1 } },
      })
      .populate('author', { username: 1, avatarLink: 1 });
    return track;
  }

  async delete(id: ObjectId): Promise<mongoose.Types.ObjectId> {
    const track = await this.trackModel.findById(id);
    track.comments.forEach(async (commentId) => {
      await this.commentModel.findByIdAndDelete(commentId);
    });
    const trackRemove = track.delete();
    const audioRemove = this.fileService.removeFile(
      FileType.AUDIO,
      track.audio.name,
    );
    const pictureRemove = this.fileService.removeFile(
      FileType.IMAGE,
      track.picture.name,
    );
    this.userService.removeUploadedTrack(track.author, track._id);
    await Promise.all([audioRemove, pictureRemove, trackRemove]);
    return track._id;
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
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

  async like(
    trackId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    const track = await this.trackModel.findById(trackId);
    await this.userService.addLikedTrack(userId, trackId);
    track.likes += 1;
    track.save();
  }

  async unlike(
    trackId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    const track = await this.trackModel.findById(trackId);
    await this.userService.removeLikedTrack(userId, trackId);
    track.likes -= 1;
    track.save();
  }

  delcom(ids) {
    ids.forEach(async (id) => {
      await this.commentModel.findByIdAndDelete(id);
    });
  }

  async checkIsTrackAuthor(userId: ObjectId, entityId: ObjectId) {
    const entity = await this.trackModel.findById(entityId);
    if (entity.author.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'You should be either an administrator or author to access this function',
      );
    }

    return entity;
  }
}
