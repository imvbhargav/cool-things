import { Review, User } from "@prisma/client";
import Image from "next/image";

type ReviewsWithUser = Review & {
  user: User;
};

function ReviewCard({review}:Readonly<{review: ReviewsWithUser}>) {

  const unvalidateUserImage = review?.user?.image;
  const validatedUserImage = (unvalidateUserImage && !['', ' '].includes(unvalidateUserImage))
                              ? unvalidateUserImage : "/profile.png";

  return (
    <div className="bg-zinc-950 mt-2 rounded-lg p-4 border-2 border-blue-500">
      <span className="flex gap-1 border-b-2 border-zinc-600/50 items-center pb-2">
        <div className="rounded-full aspect-square w-[25px] h-[25px]">
          <Image
            src={validatedUserImage} alt="User profile"
            width={25} height={25}
          />
        </div>
        <span>
          <strong className="text-blue-500 text-lg">{review?.user?.name}</strong>
          <i className="text-sm"> on 25 Jan. 2025</i>
        </span>
      </span>
      <p className="text-sm ml-6 mt-1">
        {review.content}
      </p>
    </div>
  );
}

export default ReviewCard;