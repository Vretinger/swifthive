import { useCurrentUser } from 'contexts/CurrentUserContext';
import HeroSection from 'components/home/HeroSection';
import FeatureButtons from 'components/home/FeatureButtons';
import AboutIntro from 'components/home/AboutIntro';
import FreelancerHome from 'pages/ExploreJobs';
import ClientDashboard from 'components/clients/ClientDashboard';

const Home = () => {
  const { currentUser } = useCurrentUser();

  return (
    <div>
      {currentUser?.role === "freelancer" ? (
        <FreelancerHome />
      ) : currentUser?.role === "client" ? (
        <ClientDashboard />
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
