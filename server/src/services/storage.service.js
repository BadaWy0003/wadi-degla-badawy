const StorageService = {};
const { Firestore } = require('@google-cloud/firestore');
const { bucket } = require('../start/firebase');
const { col, storagePath, canDeleteStoragePath } = require('../start/data-area');

const firestore = new Firestore();

// Public URL prefix of files in our bucket (used to turn a link back into a file path).
const bucketUrlPrefix = () => `https://storage.googleapis.com/${bucket.name}/`;

// Deletes photos that are no longer used. Only touches files in our own bucket;
// a failure is logged and never breaks the request (the product was already saved).
const deleteStorageFiles = async (links) => {
  for (const link of links) {
    if (typeof link !== 'string' || !link.startsWith(bucketUrlPrefix())) continue;
    const filePath = link.slice(bucketUrlPrefix().length);
    if (!canDeleteStoragePath(filePath)) continue; // staging never deletes production photos
    try {
      await bucket.file(filePath).delete();
    } catch (error) {
      console.error(`Failed to delete old file ${link}:`, error.message);
    }
  }
};

const uploadFileToStorage = async (file, type) => {
  const sanitizedType = type.replace(/[^a-zA-Z0-9_-]/g, '');
  // The original file name comes from the uploader's computer: keep only safe characters.
  const safeName = String(file.originalname || 'image')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(-80);

  const fileName = storagePath(`uploads/${sanitizedType}/${Date.now()}_${safeName}`);
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
  const materialsRef = firestore.collection(col('materials'));
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
    // Copy, so the old links can be compared afterwards.
    let nextFinishes = (existingData.finishes ?? []).map((f) => ({ ...f }));
    const oldLinks = nextFinishes.map((f) => f.link);

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

    // Photos that were replaced or whose finish was removed: delete them from storage.
    const keptLinks = new Set(nextFinishes.map((f) => f.link));
    await deleteStorageFiles(oldLinks.filter((link) => !keptLinks.has(link)));

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

// Hidden products (hidden: true, set from the admin panel) are left out of the public
// lists, so they disappear from the website. Admins see everything (fetchAllForAdmin).
const isVisible = (doc) => doc.hidden !== true;

StorageService.fetchMaterialsByType = async (type) => {
  const materialsRef = firestore.collection(col('materials'));
  const querySnapshot = await materialsRef.where('type', '==', type).get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no materials are found
  }

  // Map through the query snapshot and extract material data
  const materials = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(isVisible);

  return materials;
};

StorageService.fetchAllProducts = async ({ includeHidden = false } = {}) => {
  const materialsRef = firestore.collection(col('materials'));
  const querySnapshot = await materialsRef.get();

  if (querySnapshot.empty) {
    return []; // Return an empty array if no materials are found
  }

  // Map through the query snapshot and extract material data
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return includeHidden ? products : products.filter(isVisible);
};

StorageService.setProductHidden = async (productId, hidden) => {
  const docRef = firestore.collection(col('materials')).doc(productId);
  const doc = await docRef.get();
  if (!doc.exists) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  await docRef.update({ hidden });
  return { id: productId, hidden };
};

StorageService.deleteProduct = async (productId) => {
  const materialsRef = firestore.collection(col('materials'));
  const docRef = materialsRef.doc(productId);

  // Retrieve the product document
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error('Product not found');
  }

  const product = doc.data();

  // Safety: a product must be hidden before it can be deleted for good
  // (there are no photo backups). Gallery photos can be deleted directly.
  if (product.type !== 'Gallery' && product.hidden !== true) {
    const error = new Error('Hide the product first. Only hidden products can be deleted permanently.');
    error.statusCode = 409;
    throw error;
  }

  // Delete associated files from Firebase Storage
  const finishFiles = (product.finishes || []).map((finish) => finish.link); // Assuming `finishes` has `link` property
  const mockupFiles = [product.mockup, product.mockupOutdoor];

  const allFiles = [...finishFiles, ...mockupFiles];

  // Delete each file from Firebase Storage
  for (const file of allFiles) {
    if (file) {
      const fileName = file.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
      if (!canDeleteStoragePath(fileName)) continue; // staging never deletes production photos
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

// Shared with the news service: store a photo under uploads/<folder>/ and return its public
// URL; delete photos that are no longer used (only our own bucket, never outside the
// environment's storage area).
StorageService.uploadPhoto = (file, folder) => uploadFileToStorage(file, folder);
StorageService.deleteStorageFiles = deleteStorageFiles;
StorageService.isOwnStorageUrl = (link) => typeof link === 'string' && link.startsWith(bucketUrlPrefix());

module.exports = StorageService;

