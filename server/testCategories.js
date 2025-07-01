import http from 'http';

// Test creating a category
function testCreateCategory() {
  console.log('🔍 Testing create category...');
  
  const postData = JSON.stringify({
    name: 'Test Category',
    description: 'Test category description',
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
          console.log('✅ Category created successfully!');
          testUpdateCategory(response.category.id);
        } else {
          console.log('❌ Failed to create category:', response.message);
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

// Test updating a category
function testUpdateCategory(categoryId) {
  console.log('\n🔍 Testing update category...');
  
  const postData = JSON.stringify({
    name: 'Updated Test Category',
    description: 'Updated test category description',
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
          testDeleteCategory(categoryId);
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

// Test deleting a category
function testDeleteCategory(categoryId) {
  console.log('\n🔍 Testing delete category...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/categories/${categoryId}`,
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY2dqbnM1MDAwMDAxNG80YjJ1N20xanUiLCJpYXQiOjE3NTExMzQ1NTUsImV4cCI6MTc1MzcyNjU1NX0.ERQlOuhkF4YZgaTyq1oaN_GgbwGN238GGARq5RnPqI4'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Delete STATUS: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Delete RESPONSE:');
      console.log(data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Category deleted successfully!');
        } else {
          console.log('❌ Failed to delete category:', response.message);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with delete request: ${e.message}`);
  });

  req.end();
}

// Start testing
testCreateCategory(); 