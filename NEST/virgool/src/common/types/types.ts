export type TProfileImages = {
  image_profile: Express.Multer.File[];
  bg_image: Express.Multer.File[];
};
export type TGooglUser = {
  firstName?: string;
  lastName?: string;
  email: string;
  profile_image?: string;
  accessToken?: string;
};
