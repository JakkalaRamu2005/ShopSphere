const cloudinary = require('cloudinary').v2;
const logger = require('../config/logger');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload single image to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folder = 'products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    logger.error('Cloudinary upload error:', { error: error.message });
                    reject(error);
                } else {
                    logger.info('Image uploaded to Cloudinary', { url: result.secure_url });
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Upload multiple images to Cloudinary
 */
const uploadMultipleToCloudinary = async (files, folder = 'products') => {
    try {
        logger.info(`Uploading ${files.length} images to Cloudinary`);

        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folder));
        const imageUrls = await Promise.all(uploadPromises);

        logger.info(`Successfully uploaded ${imageUrls.length} images`);
        return imageUrls;
    } catch (error) {
        logger.error('Error uploading multiple images:', { error: error.message });
        throw error;
    }
};

/**
 * Delete image from Cloudinary
 */
const deleteFromCloudinary = async (imageUrl) => {
    try {
        // Extract public_id from URL
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `products/${filename.split('.')[0]}`;

        const result = await cloudinary.uploader.destroy(publicId);
        logger.info('Image deleted from Cloudinary', { publicId, result });
        return result;
    } catch (error) {
        logger.error('Error deleting from Cloudinary:', { error: error.message });
        throw error;
    }
};

/**
 * Delete multiple images from Cloudinary
 */
const deleteMultipleFromCloudinary = async (imageUrls) => {
    try {
        logger.info(`Deleting ${imageUrls.length} images from Cloudinary`);

        const deletePromises = imageUrls.map(url => deleteFromCloudinary(url));
        const results = await Promise.all(deletePromises);

        logger.info(`Successfully deleted ${results.length} images`);
        return results;
    } catch (error) {
        logger.error('Error deleting multiple images:', { error: error.message });
        throw error;
    }
};

module.exports = {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary
};
