import React, { useState, useEffect, useCallback } from "react";
import axiosPublic from "api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import Select from 'react-select';
import styles from 'styles/jobs/ExploreJobs.module.css';
import LoadingSpinner from "components/LoadingSpinner";
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

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (toastFromState) {
      window.history.replaceState({}, document.title);
    }
  }, [toastFromState]);

  const fetchJobListings = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(`/api/job-listings/listings/?page=${pageNum}`);
      const jobs = response.data.results;

      if (pageNum === 1) {
        setJobListings(jobs);
        setFilteredJobs(jobs);
      } else {
        setJobListings(prev => [...prev, ...jobs]);
        setFilteredJobs(prev => [...prev, ...jobs]);
      }

      setHasNextPage(!!response.data.next);

      if (pageNum === 1) {
        setCategories([...new Set(jobs.map(job => job.category))]);
        setLocations([...new Set(jobs.map(job => job.location))]);
        setCompanies([...new Set(jobs.map(job => job.company))]);
      }
    } catch (error) {
      console.error('Error fetching job listings:', error);
      setError('Unable to load job listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobListings(1);
  }, [fetchJobListings]);

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
    if (sortPanelOpen) setSortPanelOpen(false);
  };

  const toggleSortPanel = () => {
    setSortPanelOpen(!sortPanelOpen);
    if (filterPanelOpen) setFilterPanelOpen(false);
  };

  const applyFilters = (filters = {
    categories: selectedCategories,
    locations: selectedLocations,
    companies: selectedCompanies,
  }) => {
    const filtered = jobListings.filter((job) => {
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(job.category);
      const matchLocation = filters.locations.length === 0 || filters.locations.includes(job.location);
      const matchCompany = filters.companies.length === 0 || filters.companies.includes(job.company);
      return matchCategory && matchLocation && matchCompany;
    });
    setFilteredJobs(filtered);
  };

  const loadNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobListings(nextPage);
  };

  const loadPreviousPage = () => {
    if (page <= 1) return;
    const previousPage = page - 1;
    setPage(previousPage);
    fetchJobListings(previousPage);
  };

  const handleSelectChange = (setter) => (selectedOptions) => {
    const selectedValues = selectedOptions.map((opt) => opt.value);
    setter(selectedValues);
    const updatedFilters = {
      categories: setter === setSelectedCategories ? selectedValues : selectedCategories,
      locations: setter === setSelectedLocations ? selectedValues : selectedLocations,
      companies: setter === setSelectedCompanies ? selectedValues : selectedCompanies,
    };
    applyFilters(updatedFilters);
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading jobs..." />;

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
          <select
            onChange={(e) => {
              const newSortOption = e.target.value;
              setSortOption(newSortOption);
              const sortedJobs = [...filteredJobs].sort((a, b) => {
                if (newSortOption === 'date') {
                  return new Date(b.date_posted) - new Date(a.date_posted);
                } else if (newSortOption === 'oldest') {
                  return new Date(a.date_posted) - new Date(b.date_posted);
                }
                return 0;
              });
              setFilteredJobs(sortedJobs);
            }}
            value={sortOption}
          >
            <option value="date">Post Date (Newest First)</option>
            <option value="oldest">Post Date (Oldest First)</option>
          </select>
        </div>
      )}

      {filterPanelOpen && (
        <div className={styles.filterPanel}>
          {[
            { label: "Category", data: categories, state: selectedCategories, setter: setSelectedCategories },
            { label: "Location", data: locations, state: selectedLocations, setter: setSelectedLocations },
            { label: "Company", data: companies, state: selectedCompanies, setter: setSelectedCompanies },
          ].map(({ label, data, state, setter }) => (
            <div key={label} className={styles.filterSection}>
              <label>{label}</label>
              <Select
                options={data.map(val => ({ value: val, label: val }))}
                isMulti
                onChange={handleSelectChange(setter)}
                value={data.filter(val => state.includes(val)).map(val => ({ value: val, label: val }))}
              />
            </div>
          ))}
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
      {filteredJobs.length === 0 && <div className={styles.noJobs}>No jobs available</div>}

      <div className={styles.activeFilters}>
        {[
          { label: "Categories", state: selectedCategories, setter: setSelectedCategories },
          { label: "Locations", state: selectedLocations, setter: setSelectedLocations },
          { label: "Companies", state: selectedCompanies, setter: setSelectedCompanies },
        ].map(({ label, state, setter }) =>
          state.length > 0 && (
            <span key={label} className={styles.filterPill}>
              {label}: {state.join(', ')}
              <button onClick={() => {
                setter([]);
                applyFilters({ 
                  categories: label === "Categories" ? [] : selectedCategories,
                  locations: label === "Locations" ? [] : selectedLocations,
                  companies: label === "Companies" ? [] : selectedCompanies,
                });
              }}>x</button>
            </span>
          )
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

      <div className={styles.paginationControls}>
        {page > 1 && (
          <button onClick={loadPreviousPage} className={styles.prevPageButton}>
            Previous
          </button>
        )}
        {hasNextPage && !loading && (
          <button onClick={loadNextPage} className={styles.nextPageButton}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ExploreJobbs;
