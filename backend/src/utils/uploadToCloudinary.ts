import cloudinary from '../config/cloudinary';

export const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "smartseason_profiles" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject("Upload failed");
        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};
