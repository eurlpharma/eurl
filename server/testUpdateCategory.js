import http from 'http';

// Test updating the existing category
function testUpdateCategory() {
  console.log('🔍 Testing update category...');
  
  const categoryId = 'cmcgkrtfi0000vbuo7a36mztl';
  
  const postData = JSON.stringify({
    name: 'Updated Serume',
    description: 'Updated Serume Description',
    isActive: 'true'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/categories/${categoryId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY2dqbnM1MDAwMDAxNG80YjJ1N20xanUiLCJpYXQiOjE3NTExMzQ1NTUsImV4cCI6MTc1MzcyNjU1NX0.ERQlOuhkF4YZgaTyq1oaN_GgbwGN238GGARq5RnPqI4'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Update STATUS: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Update RESPONSE:');
      console.log(data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Category updated successfully!');
          console.log('Updated category:', response.category);
        } else {
          console.log('❌ Failed to update category:', response.message);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with update request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Start testing
testUpdateCategory(); 