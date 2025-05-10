import { useCurrentUser } from 'contexts/CurrentUserContext';
import HeroSection from 'components/home/HeroSection';
import FeatureButtons from 'components/home/FeatureButtons';
import AboutIntro from 'components/home/AboutIntro';
import FreelancerHome from 'pages/ExploreJobs';
import ClientDashboard from 'components/clients/ClientDashboard';

const Home = () => {
  const { currentUser } = useCurrentUser();

  if (currentUser?.role === "freelancer") {
    return <FreelancerHome />;
  }

  if (currentUser?.role === "client") {
    return <ClientDashboard />;
  }

  // Public home page
  return (
    <>
      <HeroSection />
      <FeatureButtons />
      <AboutIntro />
    </>
  );
};

export default Home;
