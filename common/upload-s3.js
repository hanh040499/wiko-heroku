const AWS = require('aws-sdk');

const uploadToS3 = async (file, tags, isBase64) => {
  const BUCKET_NAME = process.env.BACKUP_BUCKET;
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID || '',
    secretAccessKey: process.env.AWS_SECRET || '',
  });

  let body = '';
  let fileName = '';

  if (!isBase64) {
    fileName = file.name && file.name.split(' ').join('-');
    body = file.data;
  } else {
    const fileExt = file.charAt(0);
    if (fileExt === '/') {
      fileName = `${Date.now()}.jpeg`;
    }
    if (fileExt === 'i') {
      fileName = `${Date.now()}.png`;
    }
    body = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  }

  const fileTags = Array.isArray(tags) ? tags.join('/') : tags;

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${fileTags}/${Date.now()}-${fileName}`,
    Body: body,
    CacheControl: 'max-age=31536000',
    Tagging: fileTags,
  };

  return s3.upload(params).promise();
};

module.exports = uploadToS3;
