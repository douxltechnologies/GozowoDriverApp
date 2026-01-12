export interface SaveUserProfileRequest {
  name?: string;
  phone?: string;
  email?: string;
  dob?: string; // yyyy-MM-dd
  nationalityId?: string;
  genderId?: string;
  isSkipped?: boolean;
  profileImage?: File | null;
}