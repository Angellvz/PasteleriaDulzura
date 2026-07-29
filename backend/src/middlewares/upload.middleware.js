const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Storage Cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'pasteleria-dulzura/productos';
    if (req.baseUrl && req.baseUrl.includes('ofertas')) folder = 'pasteleria-dulzura/ofertas';
    if (req.baseUrl && req.baseUrl.includes('blog')) folder = 'pasteleria-dulzura/blog';
    if (req.baseUrl && req.baseUrl.includes('contacto')) folder = 'pasteleria-dulzura/hero';
    if (req.body && req.body.tipoFolder) folder = `pasteleria-dulzura/${req.body.tipoFolder}`;

    return {
      folder: folder,
      allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif']
    };
  }
});

// Storage Local (fallback solo fuera de Vercel)
if (!process.env.VERCEL) {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    ['productos', 'ofertas', 'blog'].forEach(subDir => {
      const dirPath = path.join(uploadsDir, subDir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  } catch (err) {
    // Silencioso si el sistema de archivos es de solo lectura
  }
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'productos';
    if (req.baseUrl && req.baseUrl.includes('ofertas')) folder = 'ofertas';
    if (req.baseUrl && req.baseUrl.includes('blog')) folder = 'blog';
    if (req.body && req.body.tipoFolder) folder = req.body.tipoFolder;
    
    const targetDir = path.join(uploadsDir, folder);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Motor de almacenamiento dinámico (se evalúa en tiempo de petición)
const dynamicStorage = {
  _handleFile: (req, file, cb) => {
    const isCloudinaryConfigured = !!(
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
       process.env.CLOUDINARY_API_KEY &&
       process.env.CLOUDINARY_API_SECRET)
    );

    const activeStorage = isCloudinaryConfigured ? cloudinaryStorage : localStorage;
    activeStorage._handleFile(req, file, cb);
  },
  _removeFile: (req, file, cb) => {
    const isCloudinaryConfigured = !!(
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
       process.env.CLOUDINARY_API_KEY &&
       process.env.CLOUDINARY_API_SECRET)
    );

    const activeStorage = isCloudinaryConfigured ? cloudinaryStorage : localStorage;
    activeStorage._removeFile(req, file, cb);
  }
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowed.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp, gif)'), false);
  }
};

const upload = multer({
  storage: dynamicStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

module.exports = upload;
