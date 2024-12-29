document.addEventListener('DOMContentLoaded', async function() {
  const apiKeyForm = document.getElementById('apiKeyForm');
  const apiKeyStatus = document.getElementById('apiKeyStatus');
  const apiKeyInput = document.getElementById('apiKey');
  const statusMessage = document.getElementById('statusMessage');
  const maskedKeyElement = document.querySelector('.masked-key');
  const toggleVisibilityBtn = document.getElementById('toggleVisibility');
  const showUpdateFormBtn = document.getElementById('showUpdateForm');
  const cancelUpdateBtn = document.getElementById('cancelUpdate');

  // Function to mask API key
  function maskApiKey(key) {
    return `sk-${'•'.repeat(8)}...${key.slice(-4)}`;
  }

  // Function to show status message
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message';
    if (type) statusMessage.classList.add(type);
  }

  // Function to update UI based on API key presence
  async function updateUIState() {
    const { apiKey } = await chrome.storage.local.get(['apiKey']);
    
    if (apiKey) {
      apiKeyStatus.style.display = 'block';
      apiKeyForm.style.display = 'none';
      maskedKeyElement.textContent = maskApiKey(apiKey);
    } else {
      apiKeyStatus.style.display = 'none';
      apiKeyForm.style.display = 'block';
      cancelUpdateBtn.style.display = 'none';
    }
  }

  // Initialize UI
  await updateUIState();

  // Toggle password visibility
  toggleVisibilityBtn.addEventListener('click', () => {
    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
    apiKeyInput.type = type;
    toggleVisibilityBtn.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });

  // Show update form
  showUpdateFormBtn.addEventListener('click', async () => {
    const { apiKey } = await chrome.storage.local.get(['apiKey']);
    apiKeyForm.style.display = 'block';
    apiKeyStatus.style.display = 'none';
    apiKeyInput.value = apiKey || '';
    cancelUpdateBtn.style.display = 'block';
    showStatus('', '');
  });

  // Cancel update
  cancelUpdateBtn.addEventListener('click', () => {
    updateUIState();
    showStatus('', '');
  });

  // Handle form submission
  apiKeyForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const apiKey = apiKeyInput.value.trim();
    const submitButton = document.querySelector('.primary-button');
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    if (!apiKey.match(/^sk-[a-zA-Z0-9_-]+$/)) {
      showStatus('Invalid API key format. It should start with "sk-"', 'error');
      return;
    }

    submitButton.disabled = true;
    showStatus('Saving API key...', '');

    try {
      // Validate the API key with a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid API key');
      }

      // Save the valid API key
      await chrome.storage.local.set({ apiKey });
      showStatus('API key saved successfully!', 'success');
      submitButton.disabled = false;
      
      // Update the UI to show the configured state
      await updateUIState();
    } catch (error) {
      console.error('Error:', error);
      showStatus('Invalid API key. Please check and try again.', 'error');
      submitButton.disabled = false;
    }
  });
});
