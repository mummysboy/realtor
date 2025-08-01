const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: 'us-east-1', // Change to your region
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'ListingsTable';

const sampleListings = [
  {
    id: 'listing-001',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown. Features include hardwood floors, stainless steel appliances, and a private balcony with city views. Walking distance to restaurants, shopping, and public transportation.',
    rent: 2200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1560448204-5f9c0b0b0b0b?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'listing-002',
    title: 'Cozy Suburban House',
    description: 'Charming 3-bedroom house in a quiet suburban neighborhood. Features a large backyard, updated kitchen, and finished basement. Perfect for families looking for space and comfort.',
    rent: 2800,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc8?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'listing-003',
    title: 'Luxury High-Rise Condo',
    description: 'Stunning 1-bedroom condo in a luxury high-rise building. Features floor-to-ceiling windows, modern amenities, fitness center, and rooftop pool. Ideal for professionals seeking a premium lifestyle.',
    rent: 3500,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    address: '789 Park Avenue',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1560448204-5f9c0b0b0b0b?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'listing-004',
    title: 'Historic Townhouse',
    description: 'Beautifully restored 4-bedroom townhouse with original architectural details. Features include exposed brick walls, high ceilings, and a private garden. Located in a historic district with easy access to downtown.',
    rent: 4200,
    bedrooms: 4,
    bathrooms: 2.5,
    sqft: 1800,
    address: '321 Elm Street',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc8?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'listing-005',
    title: 'Studio Loft',
    description: 'Modern studio loft with open floor plan and industrial design. Features high ceilings, large windows, and built-in storage. Perfect for young professionals or students.',
    rent: 1500,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 500,
    address: '654 Pine Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1560448204-5f9c0b0b0b0b?w=800'
    ],
    availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function populateSampleData() {
  console.log('🚀 Starting to populate sample data...');
  
  for (const listing of sampleListings) {
    try {
      const params = {
        TableName: TABLE_NAME,
        Item: listing,
      };
      
      await dynamodb.put(params).promise();
      console.log(`✅ Added listing: ${listing.title}`);
    } catch (error) {
      console.error(`❌ Error adding listing ${listing.title}:`, error);
    }
  }
  
  console.log('🎉 Sample data population complete!');
}

// Run the script
populateSampleData().catch(console.error); 