require("dotenv").config();
const event_feed_images = require('../../model/event_feed_images');
const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');

// Generate a random string (UUID)
const uid1 = uuidv4();


// AWS S3 configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_MINIO_ENDPOINT,
  s3ForcePathStyle: true,
});
// -------------------------------------------------------------------------------------------------------

const insertWithpost_type = async (req, res) => {
  try {
    const { caption, updated_by, id, post_id, is_deleted } = req.body;
    // Retrieve the uploaded images from req.files (using multer)
    const images = req.files;
    // Ensure images is an array
    const imageArray = Array.isArray(images) ? images : [images];

    const uploadedImageURLs = [];
    try {
      for (let index = 0; index < imageArray.length; index++) {
        const imageFile = imageArray[index];
        const imageBuffer = imageFile.buffer;

        const uploadParams = {
          Bucket: 'ebs',
          Key: `imagesEbsApp/${id}_${index + 1}_${Date.now()}.jpg`,
          Body: imageBuffer,
          ACL: 'public-read',
          ContentType: 'image/jpeg',
        };

        const s3UploadResponse = await s3.upload(uploadParams).promise();
        uploadedImageURLs.push(s3UploadResponse.Location);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error uploading images' });
      return; // Return here to prevent executing further code
    }

    // After all images are uploaded, proceed with further operations
    const uid = uuidv4();

    await db.execute('INSERT INTO post_type (uid, caption, updated_by, updated_at) VALUES (?, ?, ?, ?)', [
      uid,
      caption,
      updated_by,
      new Date(),
    ]);

    const newEventFeedImage = new event_feed_images({
      id: id,
      type: uid,
      img_uri: uploadedImageURLs,
      post_id: post_id,
      is_deleted: is_deleted || false,
      updated_by: updated_by,
    });

    const createdEventFeedImage = await newEventFeedImage.save();

    res.status(201).json(createdEventFeedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




// CREATE a new event feed image
const createEventFeedImage = async (req, res) => {
  try {
    const newEventFeedImage = new event_feed_images({
      id: req.body.id,
      type: uid1,
      img_uri: req.body.img_uri,
      post_id: req.body.post_id,
      is_deleted: req.body.is_deleted || false,
      updated_by: req.body.updated_by,
      
    });

    const createdEventFeedImage = await newEventFeedImage.save();

    res.status(201).json(createdEventFeedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all event feed images
const getAllEventFeedImages = async (req, res) => {
  try {
    const allEventFeedImages = await event_feed_images.find().populate('type');

    res.status(200).json({ success: true, data: allEventFeedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Get event feed images by post ID
const getEventFeedImagesByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const eventFeedImagesList = await event_feed_images.find({ post_id: postId }).populate('type');

    if (!eventFeedImagesList || eventFeedImagesList.length === 0) {
      return res.status(404).json({ success: false, message: 'Event feed images not found' });
    }

    res.status(200).json({ success: true, data: eventFeedImagesList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// UPDATE a particular event feed image by ID
const updateEventFeedImage = async (req, res) => {
  try {
    const eventFeedImageId = req.params.eventFeedImageId;
    const updatedEventFeedImage = await event_feed_images.findByIdAndUpdate(eventFeedImageId, req.body, { new: true });

    if (!updatedEventFeedImage) {
      return res.status(404).json({ error: 'Event feed image not found' });
    }

    res.json(updatedEventFeedImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE a particular event feed image by ID
const deleteEventFeedImage = async (req, res) => {
  try {
    const eventFeedImageId = req.params.eventFeedImageId;

    // Delete the event feed image
    await event_feed_images.findByIdAndDelete(eventFeedImageId);

    res.json({ message: 'Event feed image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  insertWithpost_type,
  createEventFeedImage,
  getAllEventFeedImages,
  getEventFeedImagesByPostId,
  updateEventFeedImage,
  deleteEventFeedImage,
};
