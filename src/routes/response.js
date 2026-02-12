const express = require('express');
const router = express.Router();
const sheetsService = require('../services/sheetsService');
const tokenService = require('../services/tokenService');
const { responseLimiter } = require('../middleware/rateLimiter');
const { validateResponseSubmission } = require('../middleware/validator');
const path = require('path');

/**
 * GET /response/:token
 * Display response form for client
 */
router.get('/:token', responseLimiter, async (req, res) => {
    try {
        const { token } = req.params;

        // Fetch client by token
        const client = await sheetsService.getClientByToken(token);

        // Validate token
        const validation = tokenService.validateToken(token, client);

        if (!validation.isValid) {
            return res.status(400).sendFile(
                path.join(__dirname, '../views/error.html')
            );
        }

        // Render response form with client data
        const html = generateResponseFormHTML(client);
        res.send(html);

    } catch (error) {
        console.error('Error displaying response form:', error);
        res.status(500).sendFile(
            path.join(__dirname, '../views/error.html')
        );
    }
});

/**
 * POST /response/:token
 * Submit client response
 */
router.post('/:token', responseLimiter, validateResponseSubmission, async (req, res) => {
    try {
        const { token } = req.params;
        const { response } = req.body;

        // Fetch client by token
        const client = await sheetsService.getClientByToken(token);

        // Validate token
        const validation = tokenService.validateToken(token, client);

        if (!validation.isValid) {
            return res.status(400).json({
                error: validation.reason
            });
        }

        // Update client response in Google Sheets
        await sheetsService.updateClientResponse(client.rowIndex, response);

        // Invalidate token
        await sheetsService.invalidateToken(client.rowIndex);

        // Return success
        res.json({
            success: true,
            message: 'Thank you for your response!'
        });

    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(500).json({
            error: 'Failed to submit response. Please try again.'
        });
    }
});

/**
 * Generate HTML for response form
 */
function generateResponseFormHTML(client) {
    const expiryDate = new Date(client.expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewal</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      padding: 40px;
      animation: slideUp 0.5s ease-out;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #333;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .subtitle {
      color: #666;
      font-size: 16px;
    }
    
    .info-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 30px 0;
      border-radius: 8px;
    }
    
    .info-box p {
      margin: 10px 0;
      color: #333;
      line-height: 1.6;
    }
    
    .info-box strong {
      color: #667eea;
    }
    
    .question {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 30px 0 20px;
    }
    
    .button-group {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }
    
    .btn {
      flex: 1;
      padding: 16px 24px;
      font-size: 18px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
    
    .btn:active {
      transform: translateY(0);
    }
    
    .btn-yes {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
    }
    
    .btn-yes:hover {
      background: linear-gradient(135deg, #45a049, #3d8b40);
    }
    
    .btn-no {
      background: linear-gradient(135deg, #f44336, #da190b);
      color: white;
    }
    
    .btn-no:hover {
      background: linear-gradient(135deg, #da190b, #c41606);
    }
    
    .loading {
      display: none;
      text-align: center;
      margin-top: 20px;
    }
    
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .success-message {
      display: none;
      text-align: center;
      padding: 30px;
    }
    
    .success-icon {
      font-size: 72px;
      margin-bottom: 20px;
    }
    
    .success-message h2 {
      color: #4CAF50;
      margin-bottom: 15px;
    }
    
    .success-message p {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div id="form-content">
      <div class="header">
        <div class="icon">📋</div>
        <h1>Subscription Renewal</h1>
        <p class="subtitle">We value your continued partnership</p>
      </div>
      
      <div class="info-box">
        <p><strong>Client Name:</strong> ${client.clientName}</p>
        <p><strong>Subscription Expires:</strong> ${expiryDate}</p>
        <p><strong>Days Remaining:</strong> 5 days</p>
      </div>
      
      <p class="question">Would you like to continue your subscription?</p>
      
      <div class="button-group">
        <button class="btn btn-yes" onclick="submitResponse('Interested')">
          ✓ Yes, Continue
        </button>
        <button class="btn btn-no" onclick="submitResponse('Not Interested')">
          ✗ No, Thanks
        </button>
      </div>
      
      <div class="loading" id="loading">
        <div class="spinner"></div>
        <p style="margin-top: 15px; color: #666;">Submitting your response...</p>
      </div>
    </div>
    
    <div class="success-message" id="success">
      <div class="success-icon">✓</div>
      <h2>Thank You!</h2>
      <p>Your response has been recorded successfully. Our team will contact you shortly.</p>
    </div>
  </div>
  
  <script>
    async function submitResponse(response) {
      const formContent = document.getElementById('form-content');
      const loading = document.getElementById('loading');
      const success = document.getElementById('success');
      
      // Show loading
      formContent.style.display = 'none';
      loading.style.display = 'block';
      
      try {
        const res = await fetch(window.location.pathname, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ response })
        });
        
        const data = await res.json();
        
        if (data.success) {
          loading.style.display = 'none';
          success.style.display = 'block';
        } else {
          throw new Error(data.error || 'Failed to submit response');
        }
      } catch (error) {
        alert('Error: ' + error.message);
        loading.style.display = 'none';
        formContent.style.display = 'block';
      }
    }
  </script>
</body>
</html>
  `;
}

module.exports = router;
