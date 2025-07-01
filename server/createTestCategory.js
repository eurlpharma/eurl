import http from 'http';

// Create a test category
function createTestCategory() {
  console.log('🔍 Creating test category...');
  
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
    console.log(`Create STATUS: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Create RESPONSE:');
      console.log(data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Test category created successfully!');
          console.log('Category ID:', response.category.id);
          console.log('Category Name:', response.category.name);
        } else {
          console.log('❌ Failed to create test category:', response.message);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error);
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