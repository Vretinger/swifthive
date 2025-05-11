import { useCurrentUser } from 'contexts/CurrentUserContext';  // Importing the custom hook to access the current user's information
import HeroSection from 'components/home/HeroSection';  // Importing HeroSection component for public home page
import FeatureButtons from 'components/home/FeatureButtons';  // Importing FeatureButtons component for public home page
import AboutIntro from 'components/home/AboutIntro';  // Importing AboutIntro component for public home page
import FreelancerHome from 'pages/ExploreJobs';  // Importing FreelancerHome page for freelancers
import ClientDashboard from 'components/clients/ClientDashboard';  // Importing ClientDashboard for clients

const Home = () => {
  const { currentUser } = useCurrentUser();  // Using custom hook to get the current user's data

  // Conditional rendering based on the user's role
  if (currentUser?.role === "freelancer") {
    return <FreelancerHome />;  // Display the FreelancerHome component if the user is a freelancer
  }

  if (currentUser?.role === "client") {
    return <ClientDashboard />;  // Display the ClientDashboard component if the user is a client
  }

  // Public home page if no user or user is neither a freelancer nor a client
  return (
    <>
      <HeroSection />  {/* Display the HeroSection component */}
      <FeatureButtons />  {/* Display the FeatureButtons component */}
      <AboutIntro />  {/* Display the AboutIntro component */}
    </>
  );
};

export default Home;
