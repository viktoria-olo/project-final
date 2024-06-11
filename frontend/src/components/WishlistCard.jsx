import { useWishStore } from "../store/useWishStore";
import { Text } from "../atoms/Text";
import { Like } from "./Like";

export const WishlistCard = ({ id, title, author, message, user, likes }) => {
  const { handleLike } = useWishStore();

  return (
    <div className="flex flex-col bg-fourth rounded-md w-full p-2">
      <div className="">
        <Text text={title} />
        <Text text={author} />
        <Text text={message} />

        <div className="flex flex-row pt-4 justify-between place-items-start">
          {/* <div className=""> */}
            <Text text={`by ${user}`} section="" />
          {/* </div> */}
          {/* <div className="border border-green-600 "> */}
            <Like
              imageUrl={
                likes > 0 ? "../icons/heartred.svg" : "../icons/heartblue.svg"
              }
              label="heart"
              onClick={(event) => handleLike(event, id)}
              likes={likes}
              className=" border-black"
            />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};
