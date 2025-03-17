import { useCurrentUser } from "../contexts/CurrentUserContext";
import HeroSection from "../components/HeroSection";
import FeatureButtons from "../components/FeatureButtons";
import AboutIntro from "../components/AboutIntro";
import FreelancerHome from "./ExploreJobs";

const Home = () => {
  const { currentUser } = useCurrentUser();

  return (
    <div>
      {currentUser?.role === "freelancer" ? (
        <FreelancerHome />
      ) : (
        <>
          <HeroSection />
          <FeatureButtons />
          <AboutIntro />
        </>
      )}
    </div>
  );
};

export default Home;
