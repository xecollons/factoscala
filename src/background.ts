import { batch } from '@pachamamas/factorial-clock-in';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.command === 'clockInPressed') {
    try {
      const response = await batch(message.params);
      sendResponse(response);
    } catch (error) {
      console.error(error);
      sendResponse({ error: error.message });
    }
    return true; // Mantenemos el canal abierto para sendResponse
  }
});