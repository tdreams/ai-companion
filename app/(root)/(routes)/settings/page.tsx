import SubscriptionButton from "@/components/SubscriptionButton";
import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser, useUser } from "@clerk/nextjs";

const SettinPage = async () => {
  const isPro = await checkSubscription();
  const user = await currentUser();

  const { userId } = auth();
  return (
    <div className="h-full p-4 space-y-2">
      <h3 className="text-lg font-medium">Settings</h3>
      <div className="text-muted-foreground text-sm">
        {isPro
          ? `${user?.firstName} You are currently on a Pro Plan.`
          : `${user?.firstName} You are currently on a Free Plan.`}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  );
};
export default SettinPage;
