import { Shell } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex justify-center items-center ">
      <Shell className="animate-spin my-12" />
    </div>
  );
}
