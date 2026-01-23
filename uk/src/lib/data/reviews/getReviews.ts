// lib/db/getReviews.ts

type GetReviewsParams = {
  slug: string;
  type: 'activity' | 'destination';
  limit?: number;
};

export async function getReviews({
  slug,
  type,
  limit = 10,
}: GetReviewsParams) {
  // ✅ DUMMY REVIEWS DATA (until table is created)
  
  const dummyReviews = [
    {
      id: '1',
      userName: 'Rahul Sharma',
      rating: 5,
      comment: 'Amazing experience! The guide was very knowledgeable and the entire trip was well organized. Highly recommended!',
      date: new Date('2025-12-15').toISOString(),
    },
    {
      id: '2',
      userName: 'Priya Singh',
      rating: 4,
      comment: 'Great tour overall. Beautiful locations and good food. Only minor issue was the transportation delay.',
      date: new Date('2025-12-10').toISOString(),
    },
    {
      id: '3',
      userName: 'Amit Patel',
      rating: 5,
      comment: 'Spiritual journey was life-changing. The peace and serenity at the destination was beyond words. Will visit again!',
      date: new Date('2025-12-05').toISOString(),
    },
    {
      id: '4',
      userName: 'Sneha Gupta',
      rating: 4,
      comment: 'Excellent arrangements and friendly staff. The accommodation was comfortable and food was delicious.',
      date: new Date('2025-11-28').toISOString(),
    },
    {
      id: '5',
      userName: 'Vikram Reddy',
      rating: 5,
      comment: 'Best adventure tour I have ever been on! Thrilling activities and safety measures were top-notch.',
      date: new Date('2025-11-20').toISOString(),
    },
    {
      id: '6',
      userName: 'Anjali Verma',
      rating: 3,
      comment: 'Good experience but felt a bit rushed. Would have liked more time at each location.',
      date: new Date('2025-11-15').toISOString(),
    },
    {
      id: '7',
      userName: 'Karan Malhotra',
      rating: 5,
      comment: 'Fantastic! Everything was perfect from start to finish. Professional service and beautiful sights.',
      date: new Date('2025-11-10').toISOString(),
    },
    {
      id: '8',
      userName: 'Neha Kapoor',
      rating: 4,
      comment: 'Memorable trip with family. Kids enjoyed every moment. Photography spots were amazing!',
      date: new Date('2025-11-05').toISOString(),
    },
  ];

  // Return limited reviews
  return dummyReviews.slice(0, limit);
}
