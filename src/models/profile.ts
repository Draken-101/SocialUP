import { Schema, model, Document } from 'mongoose';

interface ProfileDocument extends Document {
    url: string;
}

const profileSchema = new Schema<ProfileDocument>({
    url: { type: String, require: true }
  });

export default model<ProfileDocument>('Profile', profileSchema);
