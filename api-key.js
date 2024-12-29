document.addEventListener('DOMContentLoaded', function() {
  const statusMessage = document.getElementById('statusMessage');
  const apiKeyForm = document.getElementById('apiKeyForm');

  apiKeyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const apiKey = document.getElementById('apiKey').value;
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (!apiKey) {
      statusMessage.textContent = 'Please enter an API key';
      statusMessage.style.color = '#dc3545';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    statusMessage.textContent = 'Saving API key...';
    statusMessage.style.color = '#007bff';
    
    chrome.storage.local.set({ apiKey }, function() {
      console.log('API key saved successfully');
      statusMessage.textContent = 'API key saved successfully!';
      statusMessage.style.color = '#28a745';
      statusMessage.style.fontSize = '1.1em';
      submitButton.textContent = 'Saved! Redirecting...';
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Save';
      }, 2000);
    });
  });
});
