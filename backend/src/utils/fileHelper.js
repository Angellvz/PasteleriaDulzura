const fs = require('fs');
const path = require('path');

/**
 * Elimina una imagen local si la ruta pertenece a /uploads/
 * @param {string} imageUrl 
 */
const deleteLocalFile = async (imageUrl) => {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    
    const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
    
    if (normalizedUrl.startsWith('/uploads/')) {
      const relativePath = normalizedUrl.replace('/uploads/', '');
      const absolutePath = path.join(__dirname, '../../uploads', relativePath);
      
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        console.log(`🗑️ Archivo eliminado de uploads: ${relativePath}`);
      }
    }
  } catch (error) {
    console.error('Error al intentar eliminar el archivo local:', error.message);
  }
};

module.exports = { deleteLocalFile };
