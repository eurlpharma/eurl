import http from 'http';

// Create a test category
function createTestCategory() {
  
  const postData = JSON.stringify({
    name: 'Test Category for Edit',
    description: 'This is a test category for editing',
    isActive: 'true'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY2dqbnM1MDAwMDAxNG80YjJ1N20xanUiLCJpYXQiOjE3NTExMzQ1NTUsImV4cCI6MTc1MzcyNjU1NX0.ERQlOuhkF4YZgaTyq1oaN_GgbwGN238GGARq5RnPqI4'
    }
  };

  const req = http.request(options, (res) => {
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with create request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Start testing
createTestCategory(); 