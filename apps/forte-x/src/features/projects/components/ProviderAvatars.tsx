import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";

const ProviderAvatars = () => {
  return (
    <div className="flex">
      {Array.from({ length: 4 }).map((_, index) => (
        <Avatar key={index} className="-ml-2">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};

export default ProviderAvatars;
