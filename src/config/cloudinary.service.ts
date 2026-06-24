import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import * as fs from "fs";

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = "services",
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `booking-app/${folder}`,
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
            { width: 800, crop: "limit" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload error:", error);
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return reject(error || new Error("Upload failed"));
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      try {
        // If file has buffer (memory storage), use it
        if (file.buffer) {
          const readableStream = new Readable();
          readableStream.push(file.buffer);
          readableStream.push(null);
          readableStream.pipe(uploadStream);
        }
        // If file is on disk (disk storage), use the path
        else if (file.path) {
          fs.createReadStream(file.path).pipe(uploadStream);
        } else {
          reject(new Error("File has no buffer or path - cannot upload"));
        }
      } catch (error) {
        console.error("Error preparing file for upload:", error);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      }
    });
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = "services",
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<void> {
    const deletePromises = publicIds.map((publicId) =>
      this.deleteFile(publicId),
    );
    await Promise.all(deletePromises);
  }
}
