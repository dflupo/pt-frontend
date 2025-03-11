// Export all API services from a central location

import { authAPI } from './auth';
import { clientsAPI } from './clients';
import { exercisesAPI } from './exercises';
import { goalsAPI } from './goals';
import { subscriptionsAPI } from './subscriptions';
import { workoutPlansAPI } from './workoutPlans';
import { bookingsAPI } from './bookings';
import { mealPlansAPI } from './mealPlans';
import { staffAPI } from './staff';
import { usersAPI } from './users';

export {
  authAPI,
  clientsAPI,
  exercisesAPI,
  goalsAPI,
  subscriptionsAPI,
  workoutPlansAPI,
  bookingsAPI,
  mealPlansAPI,
  staffAPI,
  usersAPI
};

// Default export for convenience
export default {
  auth: authAPI,
  clients: clientsAPI,
  exercises: exercisesAPI,
  goals: goalsAPI,
  subscriptions: subscriptionsAPI,
  workoutPlans: workoutPlansAPI,
  bookings: bookingsAPI,
  mealPlans: mealPlansAPI,
  staff: staffAPI,
  users: usersAPI
};