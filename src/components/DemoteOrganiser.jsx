import { useState } from "react";
import ProfileCard from "./ProfileCard";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import supabaseClient from "../config/supabaseClient";

const DemoteOrganiser = ({ user }) => {
  const [confirmDemote, setConfirmDemote] = useState(false);
  function checkDemote() {
    setConfirmDemote(true);
  }
  function cancelDemote() {
    setConfirmDemote(false);
  }
  async function handleDemote() {
    setConfirmDemote(false);
    const { data } = await supabaseClient
      .from("userProfiles")
      .update({
        role: "member",
        adminMessage: {
          message:
            "You've been moved back to a Member role. While you won't be creating events anymore, you're still a valued part of QuestTogether and can continue joining events and enjoying the community.",
          followUp:
            "If you believe this decision was made in error, please don't hesitate to contact us — we're happy to review it with you.",
        },
      })
      .eq("id", user.id)
      .select();
  }
  return (
    <>
      <div className="border-1 border-border flex mx-5 rounded-2xl w-110 h-30">
        <ProfileCard user={user} />
        <div className="flex flex-col justify-center ml-auto mr-5">
          <button
            className="border-1 border-softred shadow-softred shadow-sm bg-softred rounded-4xl hover:cursor-pointer hover:bg-red h-10 px-3"
            onClick={checkDemote}
          >
            Demote
          </button>
        </div>
      </div>
      <Dialog
        open={confirmDemote}
        onClose={() => setConfirmDemote(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center text-charcoal">
          <DialogPanel className="max-w-lg space-y-4 border bg-beige border-1 border-darkbeige rounded-2xl p-12">
            <DialogTitle className="font-bold">Demote User</DialogTitle>
            <Description>
              This will demote {user.username} to a member
            </Description>
            <p>Are you sure you want to demote this user?</p>
            <div className="flex justify-end gap-4">
              <button
                className="border-1 py-1 px-2 rounded-2xl bg-silver"
                onClick={cancelDemote}
              >
                Cancel
              </button>
              <button
                className="border-1 py-1 px-2 rounded-2xl bg-softred"
                onClick={handleDemote}
              >
                Demote
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default DemoteOrganiser;
