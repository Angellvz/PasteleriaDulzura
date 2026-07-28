const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

/**
 * Elimina una imagen local o en Cloudinary si aplica
 * @param {string} imageUrl 
 */
const deleteLocalFile = async (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    
    // Si la URL es de Cloudinary
    if (imageUrl.includes('res.cloudinary.com')) {
      const parts = imageUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex !== -1) {
        let publicIdWithExt = parts.slice(uploadIndex + 1).join('/');
        if (publicIdWithExt.startsWith('v')) {
          publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
        }
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
        console.log(`☁️ Imagen eliminada de Cloudinary: ${publicId}`);
      }
      return;
    }
    
    const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
    
    if (normalizedUrl.startsWith('/uploads/')) {
      const relativePath = normalizedUrl.replace('/uploads/', '');
      const absolutePath = path.join(__dirname, '../../uploads', relativePath);
      
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        console.log(`🗑️ Archivo eliminado de uploads local: ${relativePath}`);
      }
    }
  } catch (error) {
    console.error('Error al intentar eliminar la imagen:', error.message);
  }
};

module.exports = { deleteLocalFile };
