const fs = require('fs');
const path = require('path');
const https = require('https');

// List of image URLs from the database
const imageUrls = [
  'https://banks-backend-2.onrender.com/uploads/1768222503645.jpeg',
  'https://banks-backend-2.onrender.com/uploads/1768107807862.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107748722.webp',
  'https://banks-backend-2.onrender.com/uploads/1768107668157.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107583928.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107509723.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107420854.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107327516.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107269638.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107189505.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768107128649.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768106956304.webp',
  'https://banks-backend-2.onrender.com/uploads/1768106901197.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768106845952.jpeg',
  'https://banks-backend-2.onrender.com/uploads/1768106774920.webp',
  'https://banks-backend-2.onrender.com/uploads/1768106706092.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768106502442.jpeg',
  'https://banks-backend-2.onrender.com/uploads/1768106332130.webp',
  'https://banks-backend-2.onrender.com/uploads/1768106254690.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768106176245.jpeg',
  'https://banks-backend-2.onrender.com/uploads/1768106082393.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768106012292.jpeg',
  'https://banks-backend-2.onrender.com/uploads/1768105918703.png',
  'https://banks-backend-2.onrender.com/uploads/1768105807018.jpg',
  'https://banks-backend-2.onrender.com/uploads/1768105721229.webp',
  'https://banks-backend-2.onrender.com/uploads/1768050527279.jpg'
];

const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting download of all product images...');

  for (const url of imageUrls) {
    const filename = path.basename(url);
    const filepath = path.join(uploadsDir, filename);

    try {
      await downloadFile(url, filepath);
    } catch (error) {
      console.error(`Error downloading ${url}:`, error.message);
    }
  }

  console.log('Download complete!');
}

downloadAllImages().catch(console.error);
