export default () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    front_url: process.env.FRONTEND_URL || 'http://localhost:3000',
    storage_root: process.env.STORAGE_ROOT || './storage/',
    storage_max_file_size: process.env.STORAGE_MAX_FILE_SIZE ? parseInt(process.env.STORAGE_MAX_FILE_SIZE) * 1024 * 1024 : 5 * 1024 * 1024, // In kilobytes
    allowed_extensions_cover_images: process.env.ALLOWED_EXTENSIONS_COVER_IMAGES ? process.env.ALLOWED_EXTENSIONS_COVER_IMAGES.split(',') : ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']
})