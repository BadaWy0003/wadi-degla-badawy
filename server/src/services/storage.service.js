const StorageService = {};
const { Firestore } = require('@google-cloud/firestore');
const { bucket } = require('../start/firebase');

const firestore = new Firestore();

const uploadFileToStorage = async (file, type) => {
  const sanitizedType = type.replace(/[^a-zA-Z0-9_-]/g, '');

  const fileName = `uploads/${sanitizedType}/${Date.now()}_${file.originalname}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  await new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', resolve);
    blobStream.end(file.buffer);
  });

  await blob.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};

StorageService.handleMaterialUpload = async ({ name, type, finish, file }) => {
  const publicUrl = await uploadFileToStorage(file, type);

  const materialsRef = firestore.collection('materials');
  const querySnapshot = await materialsRef.where('name', '==', name).where('type', '==', type).get();

  if (querySnapshot.empty) {
    const newMaterial = {
      name,
      type,
      finishes: [
        {
          finish,
          link: publicUrl,
        },
      ],
    };
    await materialsRef.add(newMaterial);
    return { message: 'Material created successfully', data: newMaterial };
  } else {
    const doc = querySnapshot.docs[0];
    const existingData = doc.data();

    const finishIndex = existingData.finishes.findIndex((f) => f.finish === finish);

    if (finishIndex >= 0) {
      existingData.finishes[finishIndex].link = publicUrl;
    } else {
      existingData.finishes.push({
        finish,
        link: publicUrl,
      });
    }

    await doc.ref.update({ finishes: existingData.finishes });

    return {
      message: `Finish "${finish}" updated successfully`,
      data: {
        name,
        type,
        finishes: existingData.finishes,
      },
    };
  }
};

module.exports = StorageService;
