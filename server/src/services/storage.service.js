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

StorageService.handleMaterialUpload = async ({ name, type, finishes, files }) => {
  const materialsRef = firestore.collection('materials');
  const querySnapshot = await materialsRef.where('name', '==', name).where('type', '==', type).get();

  // Upload files and associate them with finishes
  const uploadedFinishes = await Promise.all(
    files.map(async (file, index) => {
      const publicUrl = await uploadFileToStorage(file, type);
      return { finish: finishes[index], link: publicUrl };
    }),
  );

  if (querySnapshot.empty) {
    // Create new material
    const newMaterial = {
      name,
      type,
      finishes: uploadedFinishes,
    };
    await materialsRef.add(newMaterial);
    return { message: 'Material created successfully', data: newMaterial };
  } else {
    // Update existing material
    const doc = querySnapshot.docs[0];
    const existingData = doc.data();

    uploadedFinishes.forEach((uploadedFinish) => {
      const finishIndex = existingData.finishes.findIndex((f) => f.finish === uploadedFinish.finish);

      if (finishIndex >= 0) {
        existingData.finishes[finishIndex].link = uploadedFinish.link;
      } else {
        existingData.finishes.push(uploadedFinish);
      }
    });

    await doc.ref.update({ finishes: existingData.finishes });

    return {
      message: `Material updated successfully`,
      data: {
        name,
        type,
        finishes: existingData.finishes,
      },
    };
  }
};

StorageService.fetchMaterialsByType = async (type) => {
  const materialsRef = firestore.collection('materials');
  const querySnapshot = await materialsRef.where('type', '==', type).get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no materials are found
  }

  // Map through the query snapshot and extract material data
  const materials = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return materials;
};

StorageService.fetchAllProducts = async () => {
  const materialsRef = firestore.collection('materials');
  const querySnapshot = await materialsRef.get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no materials are found
  }

  // Map through the query snapshot and extract material data
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return products;
};

StorageService.deleteProduct = async (productId) => {
  const materialsRef = firestore.collection('materials');
  const docRef = materialsRef.doc(productId);

  // Retrieve the product document
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }

  const product = doc.data();

  // Delete associated files from Firebase Storage
  const finishFiles = product.finishes.map((finish) => finish.link); // Assuming `finishes` has `link` property
  const mockupFiles = [product.mockup, product.mockupOutdoor];

  const allFiles = [...finishFiles, ...mockupFiles];

  // Delete each file from Firebase Storage
  for (const file of allFiles) {
    if (file) {
      const fileName = file.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
      const fileRef = bucket.file(fileName);

      try {
        await fileRef.delete();
        console.log(`Deleted file from Firebase Storage: ${file}`);
      } catch (error) {
        console.error(`Failed to delete file ${file}:`, error.message);
        // Continue with other deletions even if one fails
      }
    }
  }

  // Delete the Firestore document
  await docRef.delete();

  return { message: 'Product and associated files deleted successfully' };
};


module.exports = StorageService;
