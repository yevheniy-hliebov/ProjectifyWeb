export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    front_url: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN || '3600', // in seconds
    storage_root: process.env.STORAGE_ROOT || './storage/',
    max_image_size: (process.env.STORAGE_MAX_IMAGE_SIZE ? parseInt(process.env.STORAGE_MAX_IMAGE_SIZE) : 5) * 1024 * 1024, // In kilobytes
    allowed_extensions_cover_images: process.env.ALLOWED_EXTENSIONS_COVER_IMAGES || 'jpg,jpeg,png,gif,bmp,svg,webp'
})