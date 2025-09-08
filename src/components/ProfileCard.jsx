
const ProfileCard = ({ user }) => {

  return (
    <>
      {/* p-4 rounded-xl my-4 bg-mutedwhite max-w-4xl mx-auto */}
      <div className="flex w-110">
        <img
          src={
            user.profilePicture
              ? `https://xgrtcjeypivgpykqszjq.supabase.co/storage/v1/object/public/eventMedia/${user.id}/${user.profilePicture}`
              : "NoProfilePic.jpg"
          }
          className="w-20 rounded-full h-20 m-5"
        />
        <div className="flex flex-col justify-between py-5">
          <p>Username: {user.username}</p>
          <p>First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
        </div>
        {/* <div className="flex flex-col justify-between py-3 ml-auto mr-5">
          <button
            className="border-1 border-softgreen shadow-softgreen shadow-sm bg-softgreen rounded-full hover:cursor-pointer hover:bg-green h-10 w-10"
            onClick={handleApprove}
          >
            {<CheckIcon />}
          </button>
          <button
          className="border-1 border-softred shadow-softred shadow-sm bg-softred rounded-full hover:cursor-pointer hover:bg-red h-10 w-10"
            onClick={handleDeny}
          >
            {<XMarkIcon />}
          </button>
        </div> */}
      </div>
    </>
  );
};

export default ProfileCard;
