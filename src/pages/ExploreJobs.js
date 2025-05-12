import React, { useState, useEffect } from "react";
import axiosPublic from "api/axios";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import styles from 'styles/jobs/ExploreJobs.module.css';
import LoadingSpinner from "components/LoadingSpinner";
import { useLocation } from 'react-router-dom';
import Toast from 'components/Toast';

const ExploreJobbs = () => {
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  const location = useLocation();
  const toastFromState = location.state?.toast;
  const [toast, setToast] = useState(toastFromState || null);

  const navigate = useNavigate();

  useEffect(() => {
  if (toastFromState) {
    // Remove the toast from history state so it doesn't persist on reloads or navigation
    window.history.replaceState({}, document.title);
  }
}, [toastFromState]);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const response = await axiosPublic.get('/api/job-listings/listings/');
        const jobs = response.data.results;

        setJobListings(jobs);
        setFilteredJobs(jobs);

        // Extract unique categories, locations, and companies
        setCategories([...new Set(jobs.map(job => job.category))]);
        setLocations([...new Set(jobs.map(job => job.location))]);
        setCompanies([...new Set(jobs.map(job => job.company))]);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        setError('Unable to load job listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
    if (sortPanelOpen) setSortPanelOpen(false); // close sort if open
  };

  const toggleSortPanel = () => {
    setSortPanelOpen(!sortPanelOpen);
    if (filterPanelOpen) setFilterPanelOpen(false); // close filter if open
  };

  const applyFilters = (filters = {
    categories: selectedCategories,
    locations: selectedLocations,
    companies: selectedCompanies,
  }) => {
    const filtered = jobListings.filter((job) => {
      const matchCategory =
        filters.categories.length === 0 || filters.categories.includes(job.category);
      const matchLocation =
        filters.locations.length === 0 || filters.locations.includes(job.location);
      const matchCompany =
        filters.companies.length === 0 || filters.companies.includes(job.company);
      return matchCategory && matchLocation && matchCompany;
    });
  
    setFilteredJobs(filtered); // Update the filtered job listings based on the current state of filters
  };
  

  const handleSelectChange = (setter) => (selectedOptions) => {
    const selectedValues = selectedOptions.map((opt) => opt.value);
    setter(selectedValues);
    
    // Apply filters immediately
    const updatedFilters = {
      categories: setter === setSelectedCategories ? selectedValues : selectedCategories,
      locations: setter === setSelectedLocations ? selectedValues : selectedLocations,
      companies: setter === setSelectedCompanies ? selectedValues : selectedCompanies,
    };

    applyFilters(updatedFilters);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading jobs..." />;
  }

  return (
    <div className={styles.exploreJobbs}>
      <h2>Explore Job Listings</h2>

      <div className={styles.topControls}>
        <button className={styles.sortButton} onClick={toggleSortPanel}>
          {sortPanelOpen ? "Hide Sort" : "Sort"}
        </button>

        <button className={styles.filterButton} onClick={toggleFilterPanel}>
          {filterPanelOpen ? "Hide Filters" : "Filter"}
        </button>
      </div>

      {sortPanelOpen && (
        <div className={styles.sortPanel}>
          <label>Sort By</label>
          <select onChange={(e) => {
            const newSortOption = e.target.value;
            setSortOption(newSortOption);
            
            // Sort filtered jobs immediately
            const sortedJobs = [...filteredJobs].sort((a, b) => {
              if (newSortOption === 'date') {
                // Sorting by date (newest first)
                return new Date(b.date_posted) - new Date(a.date_posted);
              } else if (newSortOption === 'oldest') {
                // Sorting by date (oldest first)
                return new Date(a.date_posted) - new Date(b.date_posted);
              }
              return 0; // Default case if needed
            });

            setFilteredJobs(sortedJobs);
          }} value={sortOption}>
            <option value="date">Post Date (Newest First)</option>
            <option value="oldest">Post Date (Oldest First)</option>
          </select>
        </div>
      )}


      {filterPanelOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterSection}>
            <label>Category</label>
            <Select
              options={categories.map(cat => ({ value: cat, label: cat }))}
              isMulti
              onChange={handleSelectChange(setSelectedCategories)}
              value={categories
                .filter(cat => selectedCategories.includes(cat))
                .map(cat => ({ value: cat, label: cat }))}
            />
          </div>
          <div className={styles.filterSection}>
            <label>Location</label>
            <Select
              options={locations.map(loc => ({ value: loc, label: loc }))}
              isMulti
              onChange={handleSelectChange(setSelectedLocations)}
              value={locations
                .filter(loc => selectedLocations.includes(loc))
                .map(loc => ({ value: loc, label: loc }))}
            />
          </div>
          <div className={styles.filterSection}>
            <label>Company</label>
            <Select
              options={companies.map(comp => ({ value: comp, label: comp }))}
              isMulti
              onChange={handleSelectChange(setSelectedCompanies)}
              value={companies
                .filter(comp => selectedCompanies.includes(comp))
                .map(comp => ({ value: comp, label: comp }))}
            />
          </div>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
      {jobListings.length === 0 && <div className={styles.noJobs}>No jobs available</div>}

      <div className={styles.activeFilters}>
        {selectedCategories.length > 0 && (
          <span className={styles.filterPill}>
            Categories: {selectedCategories.join(', ')}
            <button onClick={() => {
              setSelectedCategories([]); // Remove all selected categories
              applyFilters({ // Reapply the filter without categories
                categories: [],
                locations: selectedLocations,
                companies: selectedCompanies,
              });
            }}>x</button>
          </span>
        )}

        {selectedLocations.length > 0 && (
          <span className={styles.filterPill}>
            Locations: {selectedLocations.join(', ')}
            <button onClick={() => {
              setSelectedLocations([]); // Remove all selected locations
              applyFilters({ // Reapply the filter without locations
                categories: selectedCategories,
                locations: [],
                companies: selectedCompanies,
              });
            }}>x</button>
          </span>
        )}

        {selectedCompanies.length > 0 && (
          <span className={styles.filterPill}>
            Companies: {selectedCompanies.join(', ')}
            <button onClick={() => {
              setSelectedCompanies([]); // Remove all selected companies
              applyFilters({ // Reapply the filter without companies
                categories: selectedCategories,
                locations: selectedLocations,
                companies: [],
              });
            }}>x</button>
          </span>
        )}
      </div>




      <div className={styles.jobListings}>
        {filteredJobs.map((listing) => (
          <div
            key={listing.id}
            className={styles.jobCard}
            onClick={() => navigate(`/job/${listing.id}`)}
          >
            <div className={styles.header}>
              <h2 className={styles.jobTitle}>{listing.title}</h2>
              <span className={styles.companyName}>at {listing.company}</span>
            </div>
            <div className={styles.metaInfo}>
              <p><strong>Category:</strong> {listing.category}</p>
              <p><strong>Location:</strong> {listing.location}</p>
            </div>
            <p className={styles.description}>{listing.short_description}</p>
            <div className={styles.cardFooter}>
              <button className={styles.exploreButton}>See More</button>
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ExploreJobbs;
