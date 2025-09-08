import ProfileCard from "./ProfileCard";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/16/solid";
import supabaseClient from "../config/supabaseClient";

const PendingOrganiser = ({ user }) => {
  async function handleDecision(role) {
    const decision = { role };
    if (role === "organiser") {
      decision.adminMessage = {
        message:
          "🎉 Congratulations! You've been promoted to Organiser. You now have the power to create and manage events for the QuestTogether community. We're excited to see the adventures you'll bring to life!",
      };
    } else if (role === "member") {
      decision.adminMessage = {
        message:
          "Your request to become an Organiser wasn't approved this time. But no worries — you're still an important part of QuestTogether! You can continue joining events, meeting fellow gamers, and being part of our growing community.",
        followUp:
          "If you believe this decision was made in error, please don't hesitate to contact us — we're happy to review it with you.",
      };
    }
    const { data } = await supabaseClient
      .from("userProfiles")
      .update(decision)
      .eq("id", user.id)
      .select();
  }

  return (
    <>
      <div className="border-1 border-border flex mx-5 rounded-2xl w-110 h-30">
        <ProfileCard user={user} />
        <div className="flex flex-col justify-between py-3 ml-auto mr-5">
          <button
            className="border-1 border-softgreen shadow-softgreen shadow-sm bg-softgreen rounded-full hover:cursor-pointer hover:bg-green h-10 w-10"
            onClick={() => {
              handleDecision("organiser");
            }}
          >
            {<CheckIcon />}
          </button>
          <button
            className="border-1 border-softred shadow-softred shadow-sm bg-softred rounded-full hover:cursor-pointer hover:bg-red h-10 w-10"
            onClick={() => {
              handleDecision("member");
            }}
          >
            {<XMarkIcon />}
          </button>
        </div>
      </div>
    </>
  );
};

export default PendingOrganiser;
