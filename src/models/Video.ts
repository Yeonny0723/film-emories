import mongoose, { Model } from "mongoose";

type IVideo = mongoose.InferSchemaType<typeof VideoSchema> & {
  meta: {
    views: number;
    rating: number;
  };
};

interface VideoModel extends Model<IVideo> {
  // static method call signature를 작성해주어야지 타입스크립트가 타입추론할 수 있음.
  formatHashtags(hashtags: string): string[];
}

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 2 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

VideoSchema.statics.formatHashtags = function (hashtags) {
  // statics은 this에 모델 자체가 바인딩
  // methods은 this가 호출한 객체를 참조
  return hashtags
    .split(",")
    .map((word: string) => (word.startsWith("#") ? word : `#${word}`));
};

const Video = mongoose.model<IVideo, VideoModel>("Video", VideoSchema);

export default Video;
