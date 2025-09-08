
const AboutPage = () => {
  return (
    <>
      <div
      >
        <div className="text-charcoal flex justify-center pt-10">
          <h1 className="text-5xl font-bold">About Us</h1>
        </div>
        <div className="text-charcoal flex mt-10 pb-20">
          <div className="w-2/3 px-10">
            <h1 className="text-3xl font-bold pb-5">Our Journey</h1>
            <p className="pb-5">
              QuestTogether began as a simple idea among a tight-knit group of
              friends in 2018 who shared a passion for gaming. They noticed that
              while there were plenty of online communities for gamers, there
              wasn't an easy way to find local events, meetups, and tournaments
              in one place. Often, gaming events were scattered across different
              platforms or lost in social media posts, making it hard for
              players to connect.
            </p>
            <p className="pb-5">
              Determined to create a better solution, they started organizing
              small, casual meetups in living rooms, local cafes, and community
              centers. These early gatherings quickly grew in popularity,
              bringing together players from different backgrounds, skill
              levels, and gaming interests. The team realized that there was a
              real demand for a centralized, gamer-focused event hub, and
              QuestTogether was born.
            </p>
            <p>
              Over time, the platform evolved from these humble beginnings into
              a vibrant network of gamers, hosting events for tabletop
              enthusiasts, console players, esports competitors, and retro game
              lovers alike. Every step of the way, the mission has remained the
              same: to bring gamers together, foster connections, and create a
              space where everyone—from casual players to competitive pros—can
              enjoy their favorite games and make lasting friendships.
            </p>
          </div>
          <div className="w-1/3 flex justify-center">
            <img src={"logo.png"} className="h-100 rounded-full" />
          </div>
        </div>
        <div className="text-charcoal bg-powderblue px-10 pb-20">
          <h1 className="text-3xl font-bold pt-10 pb-5">Our Goals</h1>
          <p className="pb-5">
            At QuestTogether, our mission goes beyond simply hosting events. We
            strive to build a thriving, inclusive community where gamers of all
            types can connect, compete, and collaborate.{" "}
          </p>
          <p className="pb-5"> Our main goals include:</p>
          <div className="grid grid-cols-2 gap-2 pt-5 pb-5">
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">
                Connecting Gamers Locally and Globally
              </h3>
              <p>
                Make it easy for players to discover events, tournaments, and
                meetups in their area or online.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">Fostering Community</h3>
              <p>
                Create a welcoming, safe space where gamers of all skill levels,
                backgrounds, and interests feel included.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">Supporting Growth</h3>
              <p>
                Help gamers improve their skills, build teams, and explore new
                genres through community-driven events.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">
                Encouraging Collaboration
              </h3>
              <p>
                Facilitate opportunities for players to organize events, form
                guilds, and participate in tournaments together.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">
                Innovating for the Future
              </h3>
              <p>
                Continuously improve the platform with features like event
                recommendations, hybrid online/offline events, and rewards for
                community engagement.
              </p>
            </div>
          </div>
          <p>
            Our ultimate goal is to make QuestTogether the go-to hub for gamers
            everywhere, where every player can find meaningful connections and
            unforgettable gaming experiences.
          </p>
        </div>
        <div className="text-charcoal px-10 pb-20">
          <h1 className="text-3xl font-bold pt-10 pb-5">
            Plans for the Future
          </h1>
          <p className="pb-5">
            At QuestTogether, we're always looking ahead to make the community
            stronger, more engaging, and more accessible for all gamers.
          </p>
          <p>Some of our key plans include: </p>
          <div className="grid grid-cols-2 gap-2 pt-5 pb-5">
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">Hybrid Event Support</h3>
              <p>
                Expand beyond local meetups by offering online and hybrid
                events, so gamers worldwide can participate.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">
                Personalized Event Recommendations
              </h3>
              <p>
                Use smart algorithms to suggest events, tournaments, and meetups
                based on each user's interests and past participation.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">
                Community Rewards & Recognition
              </h3>
              <p>
                Introduce leaderboards, badges, and rewards for active members
                to encourage participation and celebrate contributions.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">
                Partnerships & Collaborations
              </h3>
              <p>
                Work with local game stores, esports teams, streaming platforms,
                and other gaming communities to provide more exciting
                opportunities.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">Enhanced Event Tools</h3>
              <p>
                Develop features for organizers to easily schedule, manage, and
                promote events, making it simple for anyone to host a successful
                gathering.
              </p>
            </div>
            <div className="p-4 border rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-xl">Inclusive Growth</h3>
              <p>
                Continue expanding to reach underrepresented gaming communities,
                ensuring that QuestTogether is welcoming and accessible to all.
              </p>
            </div>
          </div>
          <p>
            Our vision is to make QuestTogether the ultimate hub for gamers
            everywhere—a place where passion for gaming turns into meaningful
            connections, memorable experiences, and lasting friendships.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
