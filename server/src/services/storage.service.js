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

StorageService.handleMaterialUpload = async ({ id, name, type, finishes, files }) => {
  const materialsRef = firestore.collection('materials');
  const docSnapshot = id ? await materialsRef.doc(id).get() : undefined;

  finishes = finishes.map((f) => ({ ...f, finish: f.finish ?? f.finishName }));

  let uploadedFinishes = [];
  if (files.length) {
    const finishesWithoutFile = finishes.filter((f) => !f.link);

    // Map files explicitly to finishesWithoutFile based on their index
    uploadedFinishes = await Promise.all(
      files.map(async (file, index) => {
        const finish = finishesWithoutFile[index]; // Ensure correct mapping
        if (!finish) return null; // Safeguard against mismatched counts

        const publicUrl = await uploadFileToStorage(file, type); // Upload the file and get its URL
        return { finish: finish.finish, link: publicUrl }; // Use 'finish' for mapping
      }),
    );

    uploadedFinishes = uploadedFinishes.filter(Boolean); // Remove null entries
  }

  if (!docSnapshot || !docSnapshot.exists) {
    // New material creation
    const newMaterial = {
      name,
      type,
      finishes: uploadedFinishes,
    };
    await materialsRef.add(newMaterial);
    return { message: 'Material created successfully', data: newMaterial };
  } else {
    // Updating existing material
    const existingData = docSnapshot.data();
    let nextFinishes = existingData.finishes ?? [];

    uploadedFinishes.forEach((uploadedFinish) => {
      const finishIndex = nextFinishes.findIndex((f) => f.finish === uploadedFinish.finish);

      if (finishIndex >= 0) {
        nextFinishes[finishIndex].link = uploadedFinish.link; // Update existing finish
      } else {
        nextFinishes.push(uploadedFinish); // Add new finish
      }
    });

    // Filter out finishes not included in the current request
    nextFinishes = nextFinishes.filter((f) => finishes.some((ff) => ff.finish === f.finish));

    await materialsRef.doc(id).update(
      {
        name,
        type,
        finishes: nextFinishes,
      },
      {
        ignoreUndefinedProperties: true,
      },
    );

    return {
      message: `Material updated successfully`,
      data: {
        name,
        type,
        finishes: nextFinishes,
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

