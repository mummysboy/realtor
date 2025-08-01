const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: 'us-west-1', // Updated to match deployed region
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'ViewingsTable';

const sampleViewingRequests = [
  {
    id: 'request-001',
    listingId: 'listing-001',
    phone: '(555) 123-4567',
    timeSlot: '10:00 AM',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'request-002',
    listingId: 'listing-002',
    phone: '(555) 234-5678',
    timeSlot: '2:00 PM',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'request-003',
    listingId: 'listing-003',
    phone: '(555) 345-6789',
    timeSlot: '11:00 AM',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'request-004',
    listingId: 'listing-001',
    phone: '(555) 456-7890',
    timeSlot: '3:00 PM',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'request-005',
    listingId: 'listing-004',
    phone: '(555) 567-8901',
    timeSlot: '9:00 AM',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function populateSampleViewingRequests() {
  console.log('🚀 Starting to populate sample viewing requests...');
  
  for (const request of sampleViewingRequests) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Item: request,
      };
      
      await dynamodb.put(params).promise();
      console.log(`✅ Added viewing request: ${request.id} for listing ${request.listingId}`);
    } catch (error) {
      console.error(`❌ Error adding viewing request ${request.id}:`, error);
    }
  }
  
  console.log('🎉 Sample viewing requests population complete!');
}

// Run the script
populateSampleViewingRequests().catch(console.error); 