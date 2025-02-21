import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ThumbnailProps {
  url?: string | null;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative overflow-hidden max-w-[360px] h-[200px] border rounded-lg my-2 cursor-zoom-in">
          <Image
            src={url}
            alt="Message image"
            fill
            className="rounded-md object-cover"

          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <div className="relative h-[600px]">
          <Image
            src={url}
            alt="Message image"
            fill
            className="rounded-md object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
