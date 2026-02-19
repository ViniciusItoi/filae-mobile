/**
 * Quick Test Script
 * Use this to test the service layer independently
 * Run: npx ts-node src/tests/quickTest.ts
 */

import {
  AuthService,
  UserService,
  EstablishmentService,
  QueueService,
  FavoriteService,
  NotificationService,
} from '../services';

async function runQuickTest() {
  console.log('🧪 Running Filae Service Layer Quick Test\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await UserService.healthCheck();
    console.log('✅ Health:', health.status);
    console.log('');

    // Test 2: Login
    console.log('2️⃣ Testing Login...');
    const loginResponse = await AuthService.login({
      email: 'alice@example.com',
      password: 'SecurePass123!',
    });
    console.log('✅ Logged in as:', loginResponse.user.name);
    console.log('   User Type:', loginResponse.user.userType);
    console.log('   Token saved:', loginResponse.token.substring(0, 20) + '...');
    console.log('');

    // Test 3: Get Profile
    console.log('3️⃣ Testing Get Profile...');
    const profile = await UserService.getMyProfile();
    console.log('✅ Profile:', profile.name, '-', profile.email);
    console.log('');

    // Test 4: Get Establishments
    console.log('4️⃣ Testing Get Establishments...');
    const establishments = await EstablishmentService.getEstablishments();
    console.log('✅ Found', establishments.length, 'establishments');
    if (establishments.length > 0) {
      console.log('   First:', establishments[0].name);
      console.log('   Category:', establishments[0].category);
      console.log('   Queue Size:', establishments[0].currentQueueSize);
    }
    console.log('');

    // Test 5: Get Favorites
    console.log('5️⃣ Testing Get Favorites...');
    const favorites = await FavoriteService.getFavorites();
    console.log('✅ User has', favorites.length, 'favorites');
    console.log('');

    // Test 6: Get My Queues
    console.log('6️⃣ Testing Get My Queues...');
    const myQueues = await QueueService.getMyQueues();
    console.log('✅ Active Queues:', myQueues.activeQueues.length);
    console.log('   History Queues:', myQueues.historyQueues.length);
    console.log('');

    // Test 7: Get Notifications
    console.log('7️⃣ Testing Get Notifications...');
    const notifications = await NotificationService.getNotifications();
    const unreadCount = await NotificationService.getUnreadCount();
    console.log('✅ Total Notifications:', notifications.length);
    console.log('   Unread:', unreadCount);
    console.log('');

    // Test 8: Logout
    console.log('8️⃣ Testing Logout...');
    await AuthService.logout();
    console.log('✅ Logged out successfully');
    console.log('');

    console.log('🎉 All tests passed!\n');
    console.log('Service layer is working correctly! ✨');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('   Status:', error.status);

    if (error.status === 0) {
      console.error('\n⚠️  Network Error - Make sure the backend API is running at:');
      console.error('   http://localhost:8080/api');
      console.error('\n   Start the backend with:');
      console.error('   cd filae-api && mvn spring-boot:run');
    }
  }
}

// Run the test
runQuickTest();

