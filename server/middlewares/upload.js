// multerConfig.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Dynamic folder creation
const makeUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = (file.fieldname === 'workoutImage' || file.fieldname === 'workoutGif')
      ? 'uploads/workouts/'
      : 'uploads/doctors/';

    makeUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, JPG, and GIF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
