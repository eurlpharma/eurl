import http from 'http';

// Test creating a product with category
function testCreateProduct() {
  console.log('🔍 Testing create product with category...');
  
  const postData = JSON.stringify({
    name: 'Test Product',
    description: 'This is a test product',
    price: 29.99,
    category: 'cmcgkvssf0000gs0dk4yxlyjo', // Serume category ID
    countInStock: 100,
    isVisible: 'true',
    isFeatured: 'false',
    brand: 'Test Brand'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY2dqbnM1MDAwMDAxNG80YjJ1N20xanUiLCJpYXQiOjE3NTExMzQ1NTUsImV4cCI6MTc1MzcyNjU1NX0.ERQlOuhkF4YZgaTyq1oaN_GgbwGN238GGARq5RnPqI4'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Create Product STATUS: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Create Product RESPONSE:');
      console.log(data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Product created successfully!');
          console.log('Product ID:', response.product.id);
          console.log('Product Name:', response.product.name);
          console.log('Category ID:', response.product.categoryId);
        } else {
          console.log('❌ Failed to create product:', response.message);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with create product request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Start testing
testCreateProduct(); 