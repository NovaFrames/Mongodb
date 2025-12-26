/**
 * Load Puter.js SDK dynamically
 * @returns {Promise<void>}
 */
const loadPuterSDK = () => {
  return new Promise((resolve, reject) => {
    // Check if Puter is already loaded
    if (window.puter) {
      resolve();
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Puter.js SDK'));
    document.head.appendChild(script);
  });
};

/**
 * Generate images using Puter.js AI
 * @param {string} prompt - The text prompt describing the image to generate
 * @returns {Promise<Object>} - Object containing success status, images array, and optional error message
 */
export const generateImage = async (prompt) => {
  try {
    // Ensure Puter SDK is loaded
    await loadPuterSDK();

    // Wait a bit for SDK to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!window.puter || !window.puter.ai) {
      throw new Error('Puter.js SDK failed to initialize properly');
    }

    // Generate image using Puter AI
    const imageElement = await window.puter.ai.txt2img(prompt);

    // Extract the image source from the element
    let imageUrl;
    if (imageElement instanceof HTMLImageElement) {
      imageUrl = imageElement.src;
    } else if (imageElement && imageElement.src) {
      imageUrl = imageElement.src;
    } else {
      throw new Error('Invalid image element returned from Puter AI');
    }

    return {
      success: true,
      images: [imageUrl],
      message: 'Image generated successfully with Puter AI'
    };

  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      images: [],
      error: error.message || 'An error occurred while generating images'
    };
  }
};

export default generateImage;