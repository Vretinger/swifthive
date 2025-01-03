import { useCurrentUser } from "../contexts/CurrentUserContext";
import HeroSection from "../components/HeroSection";
import FeatureButtons from "../components/FeatureButtons";
import AboutIntro from "../components/AboutIntro";
import FreelancerHome from "../components/FreelancerHome";

const Home = () => {
  const currentUser = useCurrentUser();

  console.log('Current User:', currentUser); // Log the current user to inspect the data

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
