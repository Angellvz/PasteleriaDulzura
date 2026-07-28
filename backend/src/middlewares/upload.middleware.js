const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

let storage;

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
   process.env.CLOUDINARY_API_KEY &&
   process.env.CLOUDINARY_API_SECRET)
);

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folder = 'pasteleria-dulzura/productos';
      if (req.baseUrl && req.baseUrl.includes('ofertas')) folder = 'pasteleria-dulzura/ofertas';
      if (req.baseUrl && req.baseUrl.includes('blog')) folder = 'pasteleria-dulzura/blog';
      if (req.body && req.body.tipoFolder) folder = `pasteleria-dulzura/${req.body.tipoFolder}`;

      return {
        folder: folder,
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif']
      };
    }
  });
} else {
  const uploadsDir = path.join(__dirname, '../../uploads');
  ['productos', 'ofertas', 'blog'].forEach(subDir => {
    const dirPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  storage = multer.diskStorage({
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
}

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
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

module.exports = upload;
