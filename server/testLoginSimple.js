import http from 'http';

const postData = JSON.stringify({
  email: 'admin@healthy.com',
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE:');
    console.log(data);
    
    try {
      const response = JSON.parse(data);
      if (response.success && response.token) {
        console.log('\n✅ Login successful!');
        console.log('Token:', response.token);
        console.log('User role:', response.user.role);
        
        // Test admin dashboard
        testAdminDashboard(response.token);
      } else {
        console.log('\n❌ Login failed:', response.message);
      }
    } catch (error) {
      console.log('\n❌ Error parsing response:', error);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function testAdminDashboard(token) {
  console.log('\n🔍 Testing admin dashboard...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Dashboard STATUS: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Dashboard RESPONSE:');
      console.log(data);
      
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('\n✅ Admin dashboard access successful!');
        } else {
          console.log('\n❌ Admin dashboard access failed:', response.message);
        }
      } catch (error) {
        console.log('\n❌ Error parsing dashboard response:', error);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`problem with dashboard request: ${e.message}`);
  });

  req.end();
} 