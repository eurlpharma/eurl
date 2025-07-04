import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('https://eurl-server.onrender.com/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@healthy.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    console.log('Login Response:', JSON.stringify(data, null, 2));

    if (data.success && data.token) {
      console.log('\nTesting admin dashboard with token...');
      
      const dashboardResponse = await fetch('https://eurl-server.onrender.com/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        }
      });

      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard Response:', JSON.stringify(dashboardData, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin(); 